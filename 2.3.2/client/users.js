
function users() {

    get = function() {
        return axios.get("http://localhost:3000/users");
    }
    
    remove= function(id){
        return axios.delete("http://localhost:3000/users/"+id);
    }

    adding= function(user){
        return axios.put("http://localhost:3000/users", user);
    }
    
    upd=function(id,user){
        return axios.put("http://localhost:3000/users/"+id, user);
    }

    return {
        get: get,
        remove: remove,
        adding: adding,
        upd: upd
    }
}