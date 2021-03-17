class User {
    constructor(elementId) {

        this.card = document.getElementById(elementId);
        this.imageTypeElement = this.card.getElementsByClassName("center_image")[0];
        this.bodyChoice = document.getElementById("body");
        this.wheelChoice = document.getElementById("wheel");
        this.colorChoice = document.getElementById("color");
        this.sizeChoice = document.getElementById("size");
        this.saveButton = document.getElementById("saveButton");
        this.log = document.getElementById("log");
        this.userNameLabel = document.getElementById("userID");

        //====
        this.recordView = document.getElementById("recordView");
        this.recordDesigner = document.getElementById("recordDesigner");
        this.recordImage = document.getElementById("recordImage");
        this.recordBody = document.getElementById("recordBody");
        this.recordColor = document.getElementById("recordColor");
        this.recordWheel = document.getElementById("recordWheel");
        this.recordSize = document.getElementById("recordSize");
        this.revertButton = document.getElementById("revertButton");
        this.reverseChoice = null;

        //====
        this.records = {}



        this.websocket = null;
        this.retry_connection_counter = 0;
        this.maximum_connection_attempts = 10;

        this.setupConnection = this.setupConnection.bind(this);

        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);

        this.onSave = this.onSave.bind(this);
        this.ChangeCarType=this.ChangeCarType.bind(this);
        this.OnRevert = this.OnRevert.bind(this);
        this.userName = null;
        this.bodyType = "model";

        this.saveButton.onclick = this.onSave;
        this.bodyChoice.onchange = this.ChangeCarType;
        this.revertButton.onclick = this.OnRevert;



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

        this.userName = data["user_name"] || this.userName;
        this.userNameLabel.innerText=this.userName;

        if (!data["log"]) {
            return
        }
        this.log.innerHTML="";
        let index = 0;
        this.records = {};

        data["log"].forEach(log => {
            let record = document.createElement("div");
            record.id = index;
            record.className = "change_record";
            record.innerHTML = `<img class="change_user" style="width:50px; height:50px">`;
            let rec = document.createElement("div");
            rec.className = "record";
            rec.id = index;
            rec.innerHTML = `
                    <span id="${index}" class="user_label">${log["user"]}, ${log["date"]}</span>
                    <div id="${index}" class="change_content">
                       <span id="${index}" >Body Style set to ${this.bodyChoice.value}</span>
                       <span id="${index}" >Wheel Style set to ${this.wheelChoice.value}</span>
                       <span id="${index}" > Color set to ${this.colorChoice.value}</span>
                       <span id="${index}" > Size set to ${this.sizeChoice.value}</span>
                    </div>
                        `
            record.appendChild(rec);
            this.log.appendChild(record);

            this.records[index] = log;
            record.onclick = (event) => {
                this.reverseChoice = event.target.id;
                let his = this.records[this.reverseChoice];
                this.recordDesigner.innerText = `${his["user"]}, ${his["date"]}`;
                this.recordImage.src = "http://" + document.location.host + "/img/" + his["record"]["body_type"] + ".png"
                this.recordBody.innerText = `Body Style: ${his["record"]["body_style"]}`
                this.recordColor.innerText = `Color: ${his["record"]["color"]}`
                this.recordWheel.innerText = `Wheel Type: ${his["record"]["wheel_type"]}`
                this.recordSize.innerText = `Size: ${his["record"]["size"]}`

                this.recordView.style.display = "grid";
                console.log("Selecting record:", event.target.id);
            }
            ++index;
        })
        this.log.lastElementChild.scrollIntoView();

    }

    OnRevert(){
        let version = this.records[this.reverseChoice];
        console.log(version);
        this.bodyType = version.record.body_type;
        this.bodyChoice.value = version.record.body_style;
        this.colorChoice.value = version.record.color;
        this.wheelChoice.value = version.record.wheel_type;
        this.sizeChoice.value = version.record.size;
        this.imageTypeElement.src = "http://" + document.location.host + "/img/" + this.bodyType + ".png";

    }

    onError(evt) {
        console.log("Error received: ", evt);
    }

    onSave() {
        const options = {year: 'numeric', month: 'long', day: 'numeric', hour: "numeric"};
        const date = new Date().toLocaleDateString("en-US", options);
        const record = {
            body_type: this.bodyType,
            body_style: this.bodyChoice.value,
            color: this.colorChoice.value,
            wheel_type: this.wheelChoice.value,
            size: this.sizeChoice.value
        }

        const load = {
            "user": this.userName,
            "date": date,
            "record": record
        }

        console.log("sending to server the new message: ", load);
        this.websocket.send(
            JSON.stringify(load)
        )

    }
    ChangeCarType(event) {
        const new_value = event.target.value;
        switch(new_value) {
            case "Truck":
                this.bodyType = "truck";
                break
            case "Race Car":
                this.bodyType = "model";
                break
            case "Van":
                this.bodyType = "model";
                break
            case "Sedan":
                this.bodyType = "sedan";
                break
        }
        this.imageTypeElement.src = "http://" + document.location.host + "/img/" + this.bodyType + ".png";
    }

}

export {User}