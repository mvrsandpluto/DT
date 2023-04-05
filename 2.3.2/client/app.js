var app = new Vue({
    el: '#app',
    data: {
        users: [],
        msg: '',
        newUser: {name: '', city: ''},
        userid: 0,
        usersService: null,
        name: '', city:'',
        id: null,
        id1: null, name1:'',city1:'',
    },
    created: function () {
        this.usersService = users();
        this.usersService.get().then(response => (this.users = response.data));
    },
    methods: {
        remove: function() {
           console.log(this.id);
            this.usersService.remove(this.id).then(response => (location.reload()));
        
           
        },
        adding: function(){

            this.usersService.adding({name:this.name, city:this.city}).then(response => (location.reload()));
        },

        upd: function(){
            this.usersService.upd(this.id1, {name:this.name1, city:this.city1 }).then(response => (location.reload()));
        }
    }
})