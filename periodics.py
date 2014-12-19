import os
import logging
import json
import time
from datetime import date, timedelta
from flask import Flask, request, session, g, redirect, url_for, abort, \
	render_template, flash
from models import Slot_Conf
from LbNightlyTools.Utils import Dashboard

DATABASE = 'periodic'
DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_envvar('FLASKR_SETTINGS',silent = True)

def connect_db():
    database = ('http://127.0.0.1:5984/','periodic')
    server = Dashboard(db_info=database)
    return server.db 

@app.before_request
def before_request():
    g.db = connect_db()

@app.route('/')
def show_base():
    results = g.db.view('periodic/try')
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

    configs = g.db.view('periodic/periodicConfigs',reduce=False)
    temp = list()
    for c in configs:
        temp.append(c['value'])
    data = json.dumps(temp)
    
    return data

@app.route('/nightlies-periodic/applicationNews/<application>',methods=['GET'])
def applicationNews(application):

    data = []
    configs = g.db.view('periodic/periodicConfigs',reduce=False,key=application)
    for c in configs:
        name_criteria = c['value']['filename']
        time_criteria = c['value']['schedule_time']
        name_criteria = "lhcb-gaudi-head.536.Brunel.x86_64-slc6-gcc48-test.perf.[UsePRConfig].lhcbpr.PRTEST-COLLISION12-1000"
        time_criteria = "2014-11-28T00:00:00"
        results = g.db.view('periodic/periodicTests', startkey=[name_criteria,time_criteria])
        for r in results:
            data.append(r)

    data = json.dumps(data)
    return data

if __name__=='__main__':
	app.run()
