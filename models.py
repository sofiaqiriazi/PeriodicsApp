from datetime import datetime
from couchdb.mapping import Document, TextField, BooleanField, ListField, DictField, DateTimeField, TimeField
# Create your models here.

class Slot_Conf(Document):
    started = DateTimeField()
    completed = DateTimeField()
    project = TextField()
    doc_type = TextField()
