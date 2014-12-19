function(doc){
    if(doc.type == "periodic-config"){
        emit(doc._id, doc.hash_key)
    }
}

