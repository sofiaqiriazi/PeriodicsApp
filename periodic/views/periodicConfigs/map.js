function(doc) {
    if(doc.type == "periodic-config"){
        if(doc.to_run == true){
            emit(doc.project,doc)
        }
    }
}
