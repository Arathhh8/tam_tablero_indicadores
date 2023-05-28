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

// Configurar la referencia a la base de datos de Firebase
var database = firebase.database();
var datosRef = database.ref('datos');

// Obtener referencias a los botones de editar y guardar
var editButton = document.getElementById('editButton');
var saveButton = document.getElementById('saveButton');

// Agregar un evento al botón de editar
editButton.addEventListener('click', function() {
  // Habilitar la edición de los campos de la tabla
  enableEditing(true);

  // Habilitar el botón de guardar
  saveButton.disabled = false;
});

// Agregar un evento al botón de guardar
saveButton.addEventListener('click', function() {
  // Deshabilitar la edición de los campos de la tabla
  enableEditing(false);

  // Obtener los valores modificados
  var data = getModifiedData();

  // Actualizar los datos en la base de datos de Firebase
  datosRef.update(data).then(function() {
    // Mostrar un mensaje de éxito
    alert('Los datos se han guardado correctamente.');

    // Deshabilitar el botón de guardar
    saveButton.disabled = true;

    // Actualizar la tabla con los nuevos valores
    updateTable(data);
  }).catch(function(error) {
    // Mostrar un mensaje de error
    console.error('Error al guardar los datos:', error);
  });
});

// Función para habilitar o deshabilitar la edición de los campos de la tabla
function enableEditing(enabled) {
  var table = document.getElementById('myTable');
  var rows = table.rows;

  for (var i = 1; i < rows.length-1; i++) {
    var cells = rows[i].cells;

    for (var j = 1; j < cells.length; j++) {
      cells[j].contentEditable = enabled;
    }
  }
}

// Función para obtener los valores modificados de la tabla
function getModifiedData() {
  var data = {};

  var table = document.getElementById('myTable');
  var rows = table.rows;

  for (var i = 1; i < rows.length - 1; i++) {
    var row = rows[i];
    var turno = row.cells[0].innerText;

    data[turno] = {
      unidades: parseNumericValue(row.cells[1].innerText),
      pesos: parseNumericValue(row.cells[2].innerText),
      mezcla: parseNumericValue(row.cells[3].innerText),
      porcentaje: parseNumericValue(row.cells[4].innerText),
      productividadInterior: parseNumericValue(row.cells[5].innerText),
      productividadExterior: parseNumericValue(row.cells[6].innerText)
    };
  }

  // Calcular los valores de la fila "Total"
  var totalRow = rows[rows.length - 1];
  var unidadesTotal = 0;
  var pesosTotal = 0;
  var mezclaTotal = 0;
  var porcentajeTotal = 0;

  for (var i = 1; i < rows.length - 1; i++) {
    var row = rows[i];

    unidadesTotal += parseNumericValue(row.cells[1].innerText) || 0;
    pesosTotal += parseNumericValue(row.cells[2].innerText) || 0;
    mezclaTotal += parseNumericValue(row.cells[3].innerText) || 0;
    porcentajeTotal += parseNumericValue(row.cells[4].innerText) || 0;
  }

  totalRow.cells[1].innerText = unidadesTotal.toFixed(2);
  totalRow.cells[2].innerText = pesosTotal.toFixed(2);
  totalRow.cells[3].innerText = (mezclaTotal / (rows.length - 2)).toFixed(2);
  totalRow.cells[4].innerText = porcentajeTotal.toFixed(2);

  // Agregar los valores de la fila "Total" a los datos a guardar
  data['Total'] = {
    unidades: totalRow.cells[1].innerText,
    pesos: totalRow.cells[2].innerText,
    mezcla: totalRow.cells[3].innerText,
    porcentaje: totalRow.cells[4].innerText,
    productividadInterior: totalRow.cells[5].innerText,
    productividadExterior: totalRow.cells[6].innerText
  };

  return data;
}

// Función para convertir el valor de una celda en un número
function parseNumericValue(value) {
  var numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));

  if (isNaN(numericValue)) {
    return 0;
  }

  return numericValue;
}

// Función para actualizar la tabla con los nuevos valores
function updateTable(data) {
  var table = document.getElementById('myTable');
  var rows = table.rows;

  for (var i = 1; i < rows.length - 1; i++) {
    var row = rows[i];
    var turno = row.cells[0].innerText;

    if (data.hasOwnProperty(turno)) {
      var newData = data[turno];

      row.cells[1].innerText = newData.unidades;
      row.cells[2].innerText = formatCurrency(newData.pesos);
      row.cells[3].innerText = formatCurrency(newData.mezcla);
      row.cells[4].innerText = formatPercentaje(newData.porcentaje);
      row.cells[5].innerText = formatCurrency(newData.productividadInterior);
      row.cells[6].innerText = formatCurrency(newData.productividadExterior);
    }
  }

  // Actualizar la fila "Total" si existe en los datos
  if (data.hasOwnProperty('Total')) {
    var totalRow = rows[rows.length - 1];
    var totalData = data['Total'];

    totalRow.cells[1].innerText = (totalData.unidades);
    totalRow.cells[2].innerText = formatCurrency(totalData.pesos);
    totalRow.cells[3].innerText = formatCurrency(totalData.mezcla);
    totalRow.cells[4].innerText = formatPercentaje(totalData.porcentaje);
    totalRow.cells[5].innerText = totalData.productividadInterior;
    totalRow.cells[6].innerText = totalData.productividadExterior;
  }
}

// Función para formatear un valor numérico como moneda
function formatCurrency(value) {
  return '$ ' + parseFloat(value).toFixed(2);
}

function formatPercentaje(value) {
  return parseFloat(value).toFixed(2) + '%';
}

// Obtener los valores iniciales de la base de datos y mostrarlos en la tabla
datosRef.on('value', function(snapshot) {
  var data = snapshot.val();
  updateTable(data);
});



