// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6IqdekGt4bP8dhO5sVWNIVYOPpcI5q_g",
  authDomain: "tam-tablero-indicadores.firebaseapp.com",
  databaseURL: "https://tam-tablero-indicadores-default-rtdb.firebaseio.com",
  projectId: "tam-tablero-indicadores",
  storageBucket: "tam-tablero-indicadores.appspot.com",
  messagingSenderId: "685098850301",
  appId: "1:685098850301:web:ea6ee03c0d3fddac722b94"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Obtén una referencia a la base de datos
const database = firebase.database();

// Obtén una referencia a la tabla en la que quieres mostrar los datos
const table = document.getElementById("myTable");

// Vacía el contenido actual de la tabla, excepto la primera fila (encabezados)
while (table.rows.length > 1) {
  table.deleteRow(1);
}

// Obtén los datos de la base de datos y genera el contenido de la tabla
database.ref("datos").once("value", function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    // Obtiene los datos de cada registro
    const data = childSnapshot.val();
    const turno = data.turno;
    const unidades = data.unidades;
    const pesos = data.pesos;
    const mezcla = data.mezcla;
    const porcentaje = data.porcentaje;
    const productividadInterior = data.productividadInterior;
    const productividadExterior = data.productividadExterior;

    // Crea una nueva fila en la tabla con los datos obtenidos
    const row = table.insertRow(-1);
    const turnoCell = row.insertCell(0);
    const unidadesCell = row.insertCell(1);
    const pesosCell = row.insertCell(2);
    const mezclaCell = row.insertCell(3);
    const porcentajeCell = row.insertCell(4);
    const productividadInteriorCell = row.insertCell(5);
    const productividadExteriorCell = row.insertCell(6);

    // Establece el contenido de cada celda
    turnoCell.innerHTML = turno;
    unidadesCell.innerHTML = unidades;
    pesosCell.innerHTML = pesos;
    mezclaCell.innerHTML = mezcla;
    porcentajeCell.innerHTML = porcentaje;
    productividadInteriorCell.innerHTML = productividadInterior;
    productividadExteriorCell.innerHTML = productividadExterior;
  });

  // Calcula los totales
  const totalRow = table.insertRow(-1);
  const totalCell = totalRow.insertCell(0);
  totalCell.innerHTML = "Total";
  const unidadesTotalCell = totalRow.insertCell(1);
  const pesosTotalCell = totalRow.insertCell(2);
  const mezclaTotalCell = totalRow.insertCell(3);
  const porcentajeTotalCell = totalRow.insertCell(4);
  const productividadInteriorTotalCell = totalRow.insertCell(5);
  const productividadExteriorTotalCell = totalRow.insertCell(6);

  let unidadesTotal = 0;
  let pesosTotal = 0;
  let mezclaTotal = 0;
  let porcentajeTotal = 0;
  let productividadInteriorTotal = 0;
  let productividadExteriorTotal = 0;

  snapshot.forEach(function(childSnapshot) {
    const data = childSnapshot.val();
    unidadesTotal += data.unidades;
    pesosTotal += parseFloat(data.pesos.replace(",", "").replace("$", ""));
    mezclaTotal += parseFloat(data.mezcla.replace("$", ""));
    porcentajeTotal += parseFloat(data.porcentaje.replace("%", ""));
    productividadInteriorTotal += data.productividadInterior;
    productividadExteriorTotal += data.productividadExterior;
  });

  unidadesTotalCell.innerHTML = unidadesTotal;
  pesosTotalCell.innerHTML = "$" + pesosTotal.toLocaleString("en-US");
  mezclaTotalCell.innerHTML = "$" + (mezclaTotal / snapshot.numChildren()).toFixed(2);
  porcentajeTotalCell.innerHTML = (porcentajeTotal / snapshot.numChildren()).toFixed(2) + "%";
  productividadInteriorTotalCell.innerHTML = (productividadInteriorTotal / snapshot.numChildren()).toFixed(2);
  productividadExteriorTotalCell.innerHTML = (productividadExteriorTotal / snapshot.numChildren()).toFixed(2);
});



