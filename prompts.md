# Project Prompt History

This file documents all user prompts used in the creation and iteration of the Singapore LTA Bus Arrival & Real-Time Tracking application.

---

### Prompt 1: Initial Frontend Application Build

```text
build a singapore based bus arrival time application that tracks real time bus locations and proivdes accurate wait time predictions for all LTA bus stops

build just the frontend for now, i will include the backend connection later .
```

---

### Prompt 2: Git Repository Setup & Push

```text
git push https://<GITHUB_TOKEN>@github.com/kittokurrency/LTA-bus-arrival.git
```
*(Token redacted for security)*

---

### Prompt 3: Serverless LTA DataMall v3 Integration

```text
add a serverless connection that pulls live data from LTA Datamall using the following endpoints:

-store this in /api folder (project root level) not the src folder
-include /heatlh.ts and /busarrival.ts within that subfolder
-not not hardcode any key, i will include them later

GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139
# AccountKey: <LTA_ACCOUNT_KEY>
# accept: application/json
```

---

### Prompt 4: Prompt Documentation

```text
gather all the prompts and store it in prompts.md file
```
