const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");

const baseUrl = "https://appfirma.glwinba.com";

function FirmamexServices(webId, apiKey) {
  function hashAndGet(path) {
    const hmac = crypto.createHmac("sha256", apiKey);
    hmac.update(path);
    const hmacb64 = hmac.digest("base64");
    const url = baseUrl + path;
    return get(hmacb64, url);
  }

  function hashAndPost(jsonParams, path) {
    const hmac = crypto.createHmac("sha256", apiKey);
    hmac.update(JSON.stringify(jsonParams));
    const hmacb64 = hmac.digest("base64");
    const url = baseUrl + path;
    return post(jsonParams, hmacb64, url);
  }

  async function get(hmacb64, path) {
    const response = await axios.get(path, {
      headers: {
        Authorization: "signmage " + webId + ":" + hmacb64,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  async function post(params, hmacb64, path) {
    const response = await axios.post(path, params, {
      headers: {
        Authorization: "signmage " + webId + ":" + hmacb64,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  function docs(params) {
    return hashAndPost(params, "/developers/docs");
  }

  function workflow(firmamexId, params) {
    return hashAndPost(params, `/api/${firmamexId}/workflow`);
  }

  function request(params) {
    return hashAndPost(params, "/developers/json");
  }

  function saveTemplate(params) {
    return hashAndPost(params, "/developers/template/save");
  }

  function downloadDocument(docType, ticket) {
    return hashAndGet("/api/document/" + docType + "/" + ticket);
  }

  function getReport(ticket) {
    return hashAndGet("/api/report/" + ticket);
  }

  function getDocument(docType, ticket) {
    return hashAndGet(`/api/document/${docType}/${ticket}`);
  }

  function listDocuments(from, to, nextToken) {
    return hashAndGet(
      `/api/document?from=${from}&to=${to}${
        nextToken ? "&nextToken=" + nextToken : ""
      }`
    );
  }

  function createDocumentSet({ name, metadata }) {
    return hashAndPost({ name, metadata }, "/api/documentset");
  }

  function closeDocumentSet({ documentSet, workflow }) {
    return hashAndPost({ documentSet, workflow }, "/api/documentset/close");
  }

  function getDocumentSet(id) {
    return hashAndGet(`/api/documentset/${id}`);
  }

  function timestamp(params) {
    return hashAndPost(params, "/api/timestamp");
  }

  function timestampValidate({ file, timestamp }) {
    return hashAndPost(
      {
        file: file.toString("base64"),
        timestamp: timestamp.toString("base64"),
      },
      "/api/timestamp/validate"
    );
  }

  function timestampValidateHash({ hash, timestamp }) {
    return hashAndPost(
      {
        hash,
        timestamp: timestamp.toString("base64"),
      },
      "/api/timestamp/validate"
    );
  }

  async function nom151Stamp(binaryFile) {
    const hash = crypto.createHash("sha256");
    hash.update(binaryFile);
    const base64Hash = hash.digest("base64");

    const hmac = crypto.createHmac("sha256", apiKey);
    hmac.update(base64Hash);
    const hmacb64 = hmac.digest("base64");

    const data = new FormData();
    data.append("file", binaryFile, {
      filename: "file",
    });

    const response = await axios.post(baseUrl + "/api/nom151/stamp", data, {
      headers: {
        ...data.getHeaders(),
        Authorization: "signmage " + webId + ":" + hmacb64,
        "Content-SHA256": base64Hash,
      },
    });

    return response.data;
  }

  async function nom151Validate(binaryFile) {
    const hash = crypto.createHash("sha256");
    hash.update(binaryFile);
    const base64Hash = hash.digest("base64");

    const hmac = crypto.createHmac("sha256", apiKey);
    hmac.update(base64Hash);
    const hmacb64 = hmac.digest("base64");

    const data = new FormData();
    data.append("file", binaryFile, {
      filename: "file",
    });

    const response = await axios.post(baseUrl + "/api/nom151/validate", data, {
      headers: {
        ...data.getHeaders(),
        Authorization: "signmage " + webId + ":" + hmacb64,
        "Content-SHA256": base64Hash,
      },
    });

    return response.data;
  }

  return {
    request,
    downloadDocument,
    saveTemplate,
    getReport,
    getDocument,
    timestamp,
    timestampValidate,
    timestampValidateHash,
    nom151Stamp,
    nom151Validate,
    createDocumentSet,
    getDocumentSet,
    closeDocumentSet,
    docs,
    workflow,
    listDocuments,
  };
}

module.exports = FirmamexServices;
