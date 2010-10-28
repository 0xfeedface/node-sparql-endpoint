/*
{
  "head": { "vars": [ "book" , "title" ]
  } ,
  "results": { 
    "bindings": [
      {
        "book": { "type": "uri" , "value": "http://example.org/book/book6" } ,
        "title": { "type": "literal" , "value": "Harry Potter and the Half-Blood Prince" }
      }
    ]
  }
}
*/

exports.Result = function (object) {
    this._vars     = object.head.vars;
    this._bindings = object.results.bindings;
};

exports.Result.prototype = {
    /**
     * Returns an array of variable names used in the result set
     * @return array
     */
    vars: function () {
        return this._vars ? this._vars : [];
    }, 
    
    /**
     * Returns the result's bindings
     * @return array
     */
    bindings: function () {
        return this._bindings ? this._bindings : [];
    }
};