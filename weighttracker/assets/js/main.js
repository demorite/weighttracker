const form    = document.querySelector(".new-date");
const entries = document.querySelector(".entries");
const submit  = document.querySelector("[type=submit]");
const ctx     = document.getElementById("myChart").getContext("2d");

submit.addEventListener("click", function (e) {
	e.preventDefault();
	const formdata   = new FormData(form);
	const newdate1   = formdata.get("newdate");
	const newweight1 = formdata.get("newweight");
	if (newdate1 && newweight1) {
		localStorage.setItem(newdate1, newweight1);
	}
});

let localStorageOld = null;

var myChart = null;

(function loop() {
	if (JSON.stringify(localStorageOld) === JSON.stringify(localStorage)) {
		return requestAnimationFrame(loop);
	} else {
		localStorageOld   = Object.assign({}, localStorage);
		entries.innerHTML = "";
		const dates       = Object.keys(localStorage);
		for (let date of dates) {
			const li           = document.createElement("li");
			const cross        = document.createElement("span");
			li.className       = "ui item";
			cross.innerHTML    = " &cross;";
			cross.style.cursor = "pointer";
			li.style.cursor    = "pointer";
			li.onclick         = function () {
				form.querySelector("#newdate").value   = date;
				form.querySelector("#newweight").value = localStorage.getItem(date);
				form.querySelector("#newweight").focus()
			};
			cross.onclick      = function () {
				localStorage.removeItem(date);
			};
			li.innerHTML       = `${moment(date).format("DD MMMM YYYY")} : ${localStorage.getItem(date)} kg`;
			li.appendChild(cross);
			entries.appendChild(li);
		}

		if (myChart !== null) {
			myChart.data.datasets[0].data =dates.map(e => ({
				x:new Date(e),
				y:localStorage[e]
			}));
			myChart.update();
		} else {
			myChart = new Chart(ctx, {
				type: "line",
				data: {
					datasets: [{
						label: "weight/date",
						data: dates.map(e => ({
							x:new Date(e),
							y:localStorage[e]
						})),
						borderWidth: 1,
					}],
				},
				options: {
					scales: {
						yAxes: [{ticks: {beginAtZero: true}}],
						xAxes: [{type: "time",distribution: 'linear'}],
					},
				},
			});
		}

		requestAnimationFrame(loop);
	}
})();