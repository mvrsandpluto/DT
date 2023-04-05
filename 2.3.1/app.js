var app = new Vue({
    el: '#app',
    data: {
        message: '',
        secret: ''
    },
    methods: {
        process: function(){
            if (this.message == "123")
                this.secret = '1';
            if (this.message == "123")
                console.log("the message is 123");
            else
                console.log(this.message);
                            }
            }
})