import os
import logging
import json
import time

from datetime import date, timedelta
from flask import Flask, request, session, g, redirect, url_for, abort, \
	render_template, flash
from models import Per_Conf, Per_Test, First_Test, Test_Run
from LbNightlyTools.Utils import Dashboard

DATABASE = 'periodic'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_envvar('FLASKR_SETTINGS',silent = True)
app.config['COUCHDB_DATABASE']='periodic'
app.config['COUCHDB_SERVER']='http://127.0.0.1:5984/'
app.config['COUCHDB_VIEWS']='_design/periodic'


def connect_db():
    database = ('http://127.0.0.1:5984/','periodic')
    server = Dashboard(db_info=database)
    return server.db 

@app.before_request
def before_request():
    db = connect_db()

@app.route('/')
def show_base():
    results = db.view('periodic/try')
    #Slot_Conf.set_db(g.db)
    temp = list()
    for r in results:
        temp.append(r)

    data  = json.dumps(temp)
    return data
    
    #return render_template('base.html')

@app.route('/nightlies-periodic/')
def show_dashboard():
    return render_template('periodic.html')

@app.route('/nightlies-periodic/mainProjects/',methods=['GET'])
def main_projects():

    projects = ['Brunel','Moore','Gauss','DaVinci']
    data = json.dumps(projects)
    return data

@app.route('/nightlies-periodic/latestNews/',methods=['GET'])
def latest_news(project=None):
    
    #get all the configuration files
    configs = Per_Conf.view(db,'periodic/periodicConfigs',reduce=False)
    temp = list()
    for c in configs:
        temp.append(c.__dict__)
    data = json.dumps(temp)
    
    return data

@app.route('/nightlies-periodic/applicationNews/<application>',methods=['GET'])
def applicationNews(application):

    data = []
    configs = Per_Conf.view(db,'periodic/periodicConfigs',reduce=False,key=application)
    #for each configuration file inside the database ask for test results
    for c in configs:
        #name_criteria = c['value']['filename']
        #time_criteria = c['value']['schedule_time']
        #results = g.db.view('periodic/periodicTests', startkey=[name_criteria,time_criteria])
        #gather information for the specific config file
        #for r in results:
            #data.append(r)
        templist =  (c.__dict__)['_data']
        data.append(templist)

    #it never is this one cause the data is made up that is why we add it hardcoded
    #commenting this once real related data appear
    if not data:
        name_criteria = "lhcb-gaudi-head.536.Brunel.x86_64-slc6-gcc48-test.perf.[UsePRConfig].lhcbpr.PRTEST-COLLISION12-1000"
        time_criteria = "2014-11-28T00:00:00"
        results = Per_Test.view(db,'periodic/periodicTests', startkey=[name_criteria,time_criteria])
        #gather information for the specific config file
    #    for r in results:
    #        data.append(r)
    #        data.append(r)

    data = json.dumps(data)
    
    return data

@app.route('/nightlies-periodic/<filename_time>', methods=['GET'])
def slotTestCounts(filename_time):
    
    data = []
    variables = filename_time.rsplit('|',1)
    filename = variables[0]
    time = (variables[1]).split("T")[0]
    seconds = (variables[1]).split("T")[1]

    
    #find only the runs that have count equal to one
    #on the same date as the config
    tests_count_one = First_Test.view(db,'periodic/testFirstCount', key=[filename ,time ,"1" ])
    
    ftr = [3600, 60, 1]
    scheduled_on =sum([a*b for a,b in zip(ftr, map(int,seconds.split(':')))])
    trigger = variables[1]
    #find the run with smallest differnce between the scheduled time and the triggered time
    dif = 86400
    for t in tests_count_one:
        doc_trigger_on = t["trigger_on"].split('T')[1]
        triggered_on = sum([a*b for a,b in zip(ftr, map(int,doc_trigger_on.split(':')))])
        if triggered_on-scheduled_on < dif:
            trigger = t["trigger_on"]


    test_runs = Test_Run.view(db,'periodic/testCounts', key=[filename, trigger])
    for r in test_runs:
        data.append((r.__dict__)['_data'])

    data = json.dumps(data)
    return data


if __name__=='__main__':
    db = connect_db()
    app.run()
