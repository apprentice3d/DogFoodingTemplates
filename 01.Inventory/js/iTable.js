class ITable {
    constructor(divId) {
        this.dataTable = $(divId).DataTable({
            "autoWidth": true,
            "order": [[1, "asc"]],
            "paging": false,
            "searching":false,
            columns: [
                {
                    title: "",
                    "render": function (data, type, row) {
                        return '<img src="./img/' + data + '.png"  style="width:50px;"/>';
                    },
                    orderable: false,
                    searchable: false,
                    className: "thumb"
                },
                {
                    title: "Part No.",
                    className: "sorting_1"
                },
                {title: "Part Name"},
                {title: "Vendor"},
                {title: "Used In"},
                {title: "Cost"},
                {
                    title: "Quantity",
                    width: "40px"
                }
            ]

        })

        this.addButton = document.getElementById("addRec");
        this.thumb = document.getElementById("thumb");
        this.partno = document.getElementById("partno");
        this.partname = document.getElementById("partname");
        this.vendor = document.getElementById("vendor");
        this.usedin = document.getElementById("usedin");
        this.cost = document.getElementById("cost");
        this.quantity = document.getElementById("quantity");
        this.searchDialog = document.getElementById("filterSearch");

        this.setData = this.setData.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.addData = this.addData.bind(this);
        this.submitSearch = this.submitSearch.bind(this);

        this.addButton.onclick = this.addData;
        this.searchDialog.onkeypress = this.submitSearch;

    }

    setData(dataSet) {
        this.dataTable.clear();
        this.dataTable.rows.add(dataSet);
        this.dataTable.draw(false);
    }

    fetchData(endpoint) {
        fetch(document.location.origin + endpoint, {
            method: "GET",
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log("Received data: ", data);
                this.setData(data)
            })
    }

    addData() {
        const data = {
            type: this.thumb.value,
            part_no: this.partno.value,
            part_name: this.partname.value,
            vendor: this.vendor.value,
            used_in: this.usedin.value,
            cost: this.cost.value,
            quantity: this.quantity.value
        };
        this.thumb.value = "";
        this.partno.value = "";
        this.partname.value = "";
        this.vendor.value = "";
        this.usedin.value = "";
        this.cost.value = "";
        this.quantity.value = "";

        console.log("sending data to /newrecord endpoint: ", data);
        fetch(document.location.origin + "/newrecord", {
            method: "POST",
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Received updated data:", data);
                this.setData(data);
            })
    }

    submitSearch(e) {
        if(e.key == "Enter") {

            const filter =  {
                "filter": this.searchDialog.value
            }
            console.log("submitting search to /filter endpoint: ", filter);
            fetch(document.location.origin + "/filter", {
                method: "POST",
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filter)
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Received updated data:", data);
                    this.setData(data);
                })
        }
    }


}

export {
    ITable
};