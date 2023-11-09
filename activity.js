export default class activity{

    static LOCAL_STORAGE_DATA_KEY = "activity-tracker-entries";

    constructor(root){
        this.root = root;
        this.root.insertAdjacentHTML("afterbegin", activity.html());
        this.entries = [];

        this.loadEntries();
        this.updateView();

        this.root.querySelector(".tracker__add").addEventListener("click", () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");// Add 1 because months are zero indexed, minimum length of the month string should be 2
            const day = date.getDay().toString().padStart(2, "0");

            this.addEntry({
                date: `${ year }-${ month }-${ day }`,
                activity: "walk",
                duration: 30
            });
        });
    }

    static html(){
        return `
            <table class="tracker">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Activity</th>
                        <th>Duration</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody class="tracker__entries"></tbody>

                <tbody>
                    <tr class="tracker__row tracker__row--add">
                        <td colspan="4">
                            <span class="tracker__add">Add Entry &plus;</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    static rowHtml(){
        return `
            <tr class="tracker__row ">
                <td>
                    <input type="date" class="tracker__date">
                </td>
                <td>
                    <input type="text" class="tracker__activity">
                    <span class="tracker__text"></span>
                </td>
                <td>
                    <input type="number" class="tracker__duration">
                    <span class="tracker__text">minutes</span>
                </td>
                <td>
                    <button type="button" class="tracker__button tracker__delete">&times;</button>
                </td>
            </tr>
        `;
    }

    loadEntries(){
        this.entries = JSON.parse(localStorage.getItem(activity.LOCAL_STORAGE_DATA_KEY) || "[]"); 
    }

    saveEntries(){
        localStorage.setItem(activity.LOCAL_STORAGE_DATA_KEY, JSON.stringify(this.entries));
    }

    updateView(){
        const tableBody = this.root.querySelector(".tracker__entries");

        const addRow = data => {
            const template = document.createElement("template");
            let row = null;

            template.innerHTML = activity.rowHtml().trim();
            row = template.content.firstElementChild;

            row.querySelector(".tracker__date").value = data.date;
            row.querySelector(".tracker__activity").value = data.activity;
            row.querySelector(".tracker__duration").value = data.duration;

            // TODO: input changing
            row.querySelector(".tracker__date").addEventListener("change", ({ target }) => {
                data.date = target.value;
                this.saveEntries();
            });

            row.querySelector(".tracker__activity").addEventListener("change", ({ target }) => {
                data.activity = target.value;
                this.saveEntries();
            });

            row.querySelector(".tracker__duration").addEventListener("change", ({ target }) => {
                data.duration = target.value;
                this.saveEntries();
            });

            // TODO: delete row
            row.querySelector(".tracker__delete").addEventListener("click", () => {
                this.deleteEntry(data);
            });

            

            tableBody.appendChild(row);
        };

        tableBody.querySelectorAll(".tracker__row").forEach(row => {
            row.remove()
        });

        this.entries.forEach(data => addRow(data));
    }

    addEntry(data){
        this.entries.push(data);
        this.saveEntries();
        this.updateView();
    }

    deleteEntry(dataToDelete){
        this.entries =  this.entries.filter(data => data !== dataToDelete);
        this.saveEntries();
        this.updateView();
    }
}