class Client {
    constructor(elementId) {

        this.card = document.getElementById(elementId);
        this.itemNameElement = this.card.getElementsByClassName("item_name")[0];
        this.bodyTypeElement = this.card.getElementsByClassName("body_type")[0];
        this.imageTypeElement = this.card.getElementsByClassName("center_image")[0];
        this.historyElement = this.card.getElementsByClassName("history")[0];
        this.commentElement = this.card.getElementsByClassName("new_comments")[0];
        this.submitButton = this.commentElement.getElementsByTagName("button")[0];
        this.messageBox = this.commentElement.getElementsByTagName("textarea")[0];


        this.websocket = null;
        this.retry_connection_counter = 0;
        this.maximum_connection_attempts = 10;

        this.setupConnection = this.setupConnection.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);
        this.onNewComment = this.onNewComment.bind(this);

        this.submitButton.onclick = this.onNewComment;

        // this.setupConnection(this.ws_address);
    }

    setupConnection(url) {
        this.websocket = new WebSocket(url);
        this.websocket.onopen = this.onOpen;
        this.websocket.onclose = this.onClose;
        this.websocket.onmessage = this.onMessage;
        this.websocket.onerror = this.onError;
        this.ws_address = url;
    }

    onOpen(evt) {
        console.info("Connection opened: ", evt);
        this.retry_connection_counter = 0;

    }

    onClose(evt) {
        console.log("Connection closed: ", evt);

        let reconnect = (timeout) => {
            console.log("TIMEOUT:", timeout);
            setTimeout(() => {
                if (
                    this.retry_connection_counter++ < this.maximum_connection_attempts
                    && this.websocket.type !== "open") {
                    console.log("Retrying connection ...", this.retry_connection_counter);
                    this.setupConnection(this.ws_address);
                } else {
                    console.log("Stopped connecting!");
                }
            }, timeout)
        };

        reconnect(1000 * this.retry_connection_counter);
    }

    onMessage(evt) {
        let data;
        try {
            data = JSON.parse(evt.data);
        } catch (err) {
            console.log("Received message is not a JSON: ", evt.data);
            return
        }
        console.log("RECEIVED:", data);
        this.itemNameElement.textContent = data["design_name"];
        this.bodyTypeElement.textContent = data["body_design"];
        this.historyElement.innerHTML = "";
        this.imageTypeElement.src="http://"+document.location.host+"/img/"+data["body_type"] + ".png";

        if(!data["messages"]) {return}
        data["messages"].forEach( message => {
            let record = document.createElement("div");
            record.className = "change_record";
            record.innerHTML = `<img class="change_user" style="width:50px; height:50px">`;
            let rec = document.createElement("div");
            rec.className = "record";
            rec.innerHTML = `
                    <span class="user_label">${message["user"]}, ${message["date"]}</span>
                    <div class="change_content">
                        <span>${message["message"]}</span>
                    </div>
                        `
            record.appendChild(rec);
            this.historyElement.appendChild(record);
        })
        this.historyElement.lastElementChild.scrollIntoView();
    }

    onError(evt) {
        console.log("Error received: ", evt);
    }

    onNewComment() {
        const user = "Client";
        const options = {year: 'numeric', month: 'long', day: 'numeric', hour:"numeric" };
        const date  = new Date().toLocaleDateString("en-US", options);
        const message = this.messageBox.value;

        const load = {
            "user":user,
            "date": date,
            "message": message
        }

        console.log("sending to server the new message: ", load);
        this.websocket.send(
            JSON.stringify(load)
        )
        this.messageBox.value = "";

    }

}

export {Client}