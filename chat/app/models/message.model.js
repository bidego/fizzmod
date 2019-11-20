module.exports = class MessageModel {
    constructor(Model) {
        this.userId = Model.userId;
        this.username = Model.username;
        this.message = Model.message;
    }
}
