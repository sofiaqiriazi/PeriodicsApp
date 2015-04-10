function(doc){
      if(doc.type == "test-run"){
          emit([doc.filename, doc.trigger_on ],doc);
      }
}
