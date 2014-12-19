function(doc){
    if( doc.type == "test-run" && doc.count=="1" ){
        emit([ doc.filename, doc.finish_time],doc);
    }
}
