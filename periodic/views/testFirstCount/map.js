function(doc) {
    if(doc.type == "test-run" && doc.count=="1"){
        var date = (doc.trigger_on).split("T")[0];
        emit([doc.filename, date, doc.count],doc);
    }
}
