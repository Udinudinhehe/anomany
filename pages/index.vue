<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-1 py-3">
    <div class="mx-1 py-2 px-3 border border-gray-200 rounded shadow-sm">
      <h1 class="font-semibold font-inter uppercase mb-3">
        Input Jam Kejadian Anomaly :
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-inter">
        <div>
          <label for="First Time" class="font-semibold mb-4 "><i class="pi pi-clock"></i> First Time</label>
          <input
            v-model="firstTime"
            placeholder="Input Waktu Awal Kejadian"
            class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-blue-500 hover:border-slate-300 shadow-none focus:shadow"
            type="text"
          />
        </div>
        <div>
          <label for="last_time" class="font-semibold mb-4"><i class="pi pi-clock"></i> Last Time</label>
          <input
            type="text"
            v-model="lastTime"
            placeholder="Masukkan Waktu Akhir (ex:02.00)"
            class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-blue-500 hover:border-slate-300 shadow-none focus:shadow"
          />
        </div>
      </div>
      <div class="mt-4 -z-10">
        <h3 class="font-semibold"><i class="pi pi-sort-alt"></i> Pilih Rentang Waktu :</h3>
        <Select
          v-model="selectedTime"
          :options="timeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="--- Pilih Jam Anomaly ---"
          class="w-full md:w-full"
        />
      </div>
    </div>
    <div>
      <div class="p-3 border border-gray-200 rounded uppercase shadow-sm font-inter">
        <h1 class="font-semibold uppercase mb-3">Auto Generate</h1>

        <div>
          <label for="font-medium">Input Dashboard</label>
          <textarea
            v-model="dashboardInput"
            rows="8"
            class="w-full p-2 border border-gray-200 rounded mt-1 outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Masukkan Inputan Dashboard ..."
          ></textarea>
        </div>

        <div>
          <label class="font-medium">Input Security Event</label>
          <textarea
            v-model="securityEvent"
            rows="10"
            class="w-full p-2 border border-gray-200 rounded mt-1 outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Masukkan Security Event "
          ></textarea>
        </div>
        <div>
          <label class="font-medium">Input IP Reputation</label>
          <textarea
            v-model="ipReputation"
"
            rows="8"
            class="w-full p-2 border border-gray-200 rounded mt-1 outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Masukkan IP Reputation (Country, City, ASN/ISP, Risk Score)"
          ></textarea>
        </div>
        <button
          @click="generateCaption"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer mr-2"
        >
          <i class="pi pi-file"></i> Generate Caption
        </button>
        <button
          @click="resetForm"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
        >
          <i class="pi pi-trash"></i> Reset
        </button>
      </div>
      <!-- GENERATE CAPTION -->
      <div class="mt-3 mb-2">
        <Panel header="Caption 1" toggleable v-if="alertCaption">
          <p class="m-0 whitespace-pre-wrap">
            {{ alertCaption }}
          </p>
          <button
            @click="copyAlertCaption"
            class="mt-2 px-4 py-2 text-white border border-blue-500 bg-blue-500 rounded mb-2 cursor-pointer"
          >
            Copy Caption
          </button>
        </Panel>
      </div>
      <div class="mt-3 mb-2">
        <Panel header="Caption 2" toggleable v-if="wafCaptionVisible">
          <p class="m-0 whitespace-pre-wrap">
            {{ wafCaption }}
          </p>
          <button
            v-if="wafCaptionVisible"
            @click="copyWafCaption"
            class="mt-2 px-4 py-2 text-white border border-blue-500 bg-blue-500 rounded mb-2 cursor-pointer"
          >
            Copy Caption
          </button>
        </Panel>
      </div>
      <div class="mt-3 mb-2">
        <Panel header="Caption 3" toggleable v-if="captionVisible">
          <p class="m-0 whitespace-pre-wrap">
            {{ caption }}
          </p>
          <button
            @click="copyCaption"
            :disabled="!captionVisible"
            class="mt-2 px-4 py-2 text-white border border-blue-500 bg-blue-500 rounded mb-2 cursor-pointer"
          >
            Copy Caption
          </button>
        </Panel>
      </div>

      <div class="mt-3 mb-2">
        <Panel header="Caption 4" toggleable v-if="captionResultVisible">
          <p class="m-0 whitespace-pre-wrap">
            {{ captionResult }}
          </p>
          <button
            @click="copyIpReputationCaption"
            class="mt-2 px-4 py-2 text-white border border-blue-500 bg-blue-500 rounded mb-2 cursor-pointer"
          >
            Copy Caption
          </button>
        </Panel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import "zone.js";
import dayjs from "dayjs";
import Panel from "primevue/panel";
import { useToast } from "primevue/usetoast";
import Select from "primevue/select";
import 'primeicons/primeicons.css';
// Day JS
import 'dayjs/locale/id';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Insialisasi Day JS
dayjs.extend(customParseFormat)
dayjs.locale('id')
// import "pandora-css/css/pandora.css";

const dashboardInput = ref("");
const securityEvent = ref("");
const caption = ref("");
const wafCaption = ref("");
const captionVisible = ref(false);
const wafCaptionVisible = ref(false);
const alertCaption = ref("");
const alertWarning = ref("");
const toast = useToast();

const firstTime = ref("");
const lastTime = ref("");
const dropdownTime = ref("");
const selectedTime = ref(null);
const ipReputation = ref("");
const captionResult = ref("");
const captionResultVisible = ref(false);

const extract = (label) => {
  const lines = dashboardInput.value.split("\n");
  const index = lines.findIndex(
    (line) => line.trim().toLowerCase() === label.toLowerCase()
  );

  const value = lines[index + 1].trim();

  if (label.toLowerCase() === "website") {
    // Ambil hanya nama domain tanpa angka di belakang
    const match = value.match(/^([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    return match ? match[1] : "-";
  }

  return index !== -1 && lines[index + 1] ? lines[index + 1].trim() : "-";
  
};
  
const generateCaption = () => {
  const eventMap = new Map()
  alertWarning.value = "";
  alertCaption.value = "";

  if (!firstTime.value || !lastTime.value || !selectedTime.value || !ipReputation.value) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail:
        "Harap Lengkapi Data ! (Jam Anomaly, Input Dashboard,Input Security Event, Ip Reputation ) Terlebih Dahulu Sebelum Mengenerate Data !",
      life: 5000,
    });
    return;
  }

  const lines = securityEvent.value.split("\n");
  const activeEvents = [];
  const wafEvents = [];

  lines.forEach((line) => {
    const match = line.match(/^(.+?)\s+(\d+)$/);
    if (match) {
      const name = match[1].trim();
      const count = parseInt(match[2]);
      if (count > 0) {
        activeEvents.push(`*${name}*`);
        wafEvents.push(`*${name}* Sebanyak ${count} Sessions`);
      }
    }
  });

  const domain = extract("Website", dashboardInput.value);
  // Formatted Time and Date
  const rawDate = extract("Time").split(",")[0] || "-";
  let formattedDate = rawDate;
  try{
    formattedDate = dayjs(rawDate, "MMM DD YYYY")
      .locale('id')
      .format("DD MMMM YYYY")
  }catch(e){
    formattedDate = rawDate;
  }
  // Alert Caption
  if (domain !== "-" && rawDate !== "-") {
    alertCaption.value = `⚠️ANOMALY TRAFFIC ALERT NOTIFICATION⚠️\n\nDomain/Website : *${domain}*\n\nHari & Tanggal : *${formattedDate}*\n\nJam : *${selectedTime.value}*\n\nUpdate alert notification anomaly traffic, pada jam *${firstTime.value} - ${lastTime.value} WIB* telah terjadi peningkatan blocking traffic requests overtime yang terjadi di domain *${domain}*.`;
  }

  // Caption 3
  for (let i = 0; i < lines.length; i += 2) {
  const eventLine = lines[i]?.trim() || ''
  const match = eventLine.match(/^(.+?)\s+(\d+)$/)

  if (match) {
    const eventName = match[1].trim()
    const count = parseInt(match[2])
    if (count > 0 && !activeEvents.includes(`*${eventName}*`)) {
      activeEvents.push(`*${eventName}*`)
    }
  }
}
let result = "";
if (activeEvents.length > 0) {
  result += `Berikut adalah Detail Events dari Type ${activeEvents.join(', ')} tersebut sebagai berikut :\n\n`
}

  const clientType = extract("Client Type");
  const clientApp = extract("Client App");
  const method = extract("Method");
  const time = extract("Time");
  const country = extract("Country");
  const sourceIP = extract("Source IP");
  const status = extract("Status");

  // Format Tanggal
  let formattedTime = time
  try{
    formattedTime = dayjs(time, 'MMM DD YYYY, HH:mm:ss')
      .locale('id')
      .format('DD MMMM YYYY, HH:mm:ss')
  }catch(e){
    formattedTime = time
  }
  result += `Client Type : ${clientType}\nClient App : ${clientApp}\nMethod : ${method}\nTime : ${formattedTime}\nCountry : ${country}\nSource IP : ${sourceIP}\nStatus : Blocked`;

  caption.value = result;
  captionVisible.value = result.trim() !== "";

  // Caption 2
  // if (wafEvents.length > 0) {
  //   wafCaption.value =
  //     `Setelah dilakukan pengecekan pada dashboard WAF Policies dan Security Rules, ` +
  //     `insiden anomali tersebut memicu WAF dengan jenis Incident ${wafEvents.join(
  //       ", "
  //     )}.`;
  //   wafCaptionVisible.value = true;
  // } else {
  //   wafCaption.value = "";
  //   wafCaptionVisible.value = false;
  // }
  for (let i = 0; i < lines.length; i += 2) {
    const eventLine = lines[i]?.trim() || ''
    const match = eventLine.match(/(.+?)\s+(\d+)/)

    if (match) {
      const eventName = match[1].trim()
      const count = parseInt(match[2])
      if (count > 0 && !eventMap.has(eventName)) {
        eventMap.set(eventName, count)
      }
    }
  }

  const uniqueEvents = Array.from(eventMap.entries()).map(
    ([name, count]) => `*${name}* sebanyak ${count} sessions`
  )

  if (uniqueEvents.length > 0) {
    wafCaption.value =
      `Setelah dilakukan pengecekan pada dashboard WAF Policies dan Security Rules, ` +
      `insiden anomali tersebut memicu WAF dengan jenis Incident ${uniqueEvents.join(', ')}.`
    wafCaptionVisible.value = true
  } else {
    wafCaption.value = ''
    wafCaptionVisible.value = false
  }
  // parsing IP
  const ipRegex = /(\b\d{1,3}(?:\.\d{1,3}){3}\b)/;
  const matchedIP = dashboardInput.value.match(ipRegex);
  const source = matchedIP ? matchedIP[0] : "-";

  // parsing security event
  const rawSecEvent = securityEvent.value.trim();
  const filteredEvents = rawSecEvent
    .split("\n")
    .filter((line) => {
      const match = line.match(/(\d+)/);
      return match && parseInt(match[1]) > 0;
    })
    .map((line) => line.replace(/\d+/g, "").trim());
  const formattedEvents = filteredEvents.join(", ");

  // parsing ip reputation
  const rawIpRep = ipReputation.value.trim();
  const ipRepLines = rawIpRep.split('\n').map(line => line.trim());
  
  function extractAfter(label) {
    const index = ipRepLines.findIndex(line => line.toLowerCase() === label.toLowerCase());
    return index !== -1 && index + 1 < ipRepLines.length ? ipRepLines[index + 1] : "-";
  }

  const NameCountry = extractAfter("Country");
  const city = extractAfter("City");
  const asn = extractAfter("ASN");
  const riskScore = extractAfter("Risk Score");
  // let NameCountry = rawIpRep.match(/Country\s*:\s*(.+)/i)?.[1].trim() || "-";
  // let city = rawIpRep.match(/City\s*:\s*(.+)/i)?.[1].trim() || "-";
  // let asn = rawIpRep.match(/ASN\/ISP\s*:\s*(.+)/i)?.[1].trim() || "-";
  // let riskScore = rawIpRep.match(/Risk Score\s*:\s*(.+)/i)?.[1].trim() || "-";

  if (source === "-") {
    caption.value =
      "Pastikan field Source IP (dashboard input) memiliki IP yang valid!";
    return;
  }

  captionResult.value =
    `Dan berikut adalah Informasi dari Source IP *${source}*` +
    (formattedEvents
      ? ` yang telah melakukan serangan *${formattedEvents}*`
      : "") +
    ` yang dilihat dari IP Reputation Intelligence:\n\n` +
    `Country: ${NameCountry}\nCity: ${city}\nASN/ISP: ${asn}\nRisk Score: ${riskScore}`;
  
    captionResultVisible.value = true
  
};

// Daftar Jam Anomaly
const timeOptions = [
  { label: "08.00 - 10.00", value: "08.00 - 10.00" },
  { label: "10.00 - 12.00", value: "10.00 - 12.00" },
  { label: "12.00 - 14.00", value: "12.00 - 14.00" },
  { label: "14.00 - 16.00", value: "14.00 - 16.00" },
  { label: "16.00 - 18.00", value: "16.00 - 18.00" },
  { label: "18.00 - 20.00", value: "18.00 - 20.00" },
  { label: "20.00 - 22.00", value: "20.00 - 22.00" },
  { label: "22.00 - 24.00", value: "22.00 - 24.00" },
  { label: "24.00 - 00.00", value: "24.00 - 00.00" },
  { label: "00.00 - 02.00", value: "00.00 - 02.00" },
];

// Copy Fungctions
const copyCaption = async () => {
  let combined = caption.value;
  if (wafCaption.value) {
    combined += "\n\n" + wafCaption.value;
  }
  await navigator.clipboard.writeText(combined);
  alert("Caption berhasil disalin!");
};

const copyWafCaption = async () => {
  if (wafCaption.value.trim()) {
    await navigator.clipboard.writeText(wafCaption.value);
    alert("Caption WAF berhasil disalin!");
  }
};

const copyAlertCaption = async () => {
  if (alertCaption.value.trim()) {
    await navigator.clipboard.writeText(alertCaption.value);
    alert("Caption Alert berhasil disalin!");
  }
};

const copyIpReputationCaption = async () => {
  if (captionResult.value.trim()) {
    await navigator.clipboard.writeText(captionResult.value);
    alert("Caption IP Reputation berhasil disalin!");
  }
};

// Reset Form
const resetForm = () => {
  dashboardInput.value = "";
  securityEvent.value = "";
  caption.value = "";
  wafCaption.value = "";
  alertCaption.value = "";
  alertWarning.value = "";
  firstTime.value = "";
  lastTime.value = "";
  dropdownTime.value = "";
  selectedTime.value = null;
  captionVisible.value = false;
  wafCaptionVisible.value = false;
  alertWarning.value = "";
  alertCaption.value = "";
  ipReputation.value = "";
  captionResultVisible.value = false
};
</script>
