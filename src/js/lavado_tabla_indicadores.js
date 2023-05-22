// Obtener referencias a los elementos de la tabla y los botones
const table = document.getElementById('myTable');
const editButton = document.getElementById('editButton');
const saveButton = document.getElementById('saveButton');

// Agregar un evento de clic al botón de editar
editButton.addEventListener('click', function() {
  // Habilitar la edición de las celdas de las filas Turno 1, Turno 2 y Turno 3
  enableCellEditing(table, [1, 2, 3]);
  
  // Habilitar el botón de guardar
  saveButton.disabled = false;
});

// Agregar un evento de clic al botón de guardar
saveButton.addEventListener('click', function() {
  // Deshabilitar la edición de las celdas de las filas Turno 1, Turno 2 y Turno 3
  disableCellEditing(table, [1, 2, 3]);
  
  // Deshabilitar el botón de guardar
  saveButton.disabled = true;
  
  // Calcular los valores de la fila "Total"
  calculateTotal(table);
});

// Función para habilitar la edición de las celdas de las filas especificadas
function enableCellEditing(table, rowIndexes) {
  for (let i = 0; i < rowIndexes.length; i++) {
    const row = table.rows[rowIndexes[i]];
    const cells = row.cells;
    
    for (let j = 1; j < cells.length; j++) {
      const cell = cells[j];
      
      // Crear un elemento <input> y establecer su valor como el contenido de la celda
      const input = document.createElement('input');
      input.value = cell.textContent;
      
      // Reemplazar el contenido de la celda con el elemento <input>
      cell.innerHTML = '';
      cell.appendChild(input);
    }
  }
}

// Función para deshabilitar la edición de las celdas de las filas especificadas
function disableCellEditing(table, rowIndexes) {
  for (let i = 0; i < rowIndexes.length; i++) {
    const row = table.rows[rowIndexes[i]];
    const cells = row.cells;
    
    for (let j = 1; j < cells.length; j++) {
      const cell = cells[j];
      
      // Obtener el valor del elemento <input> dentro de la celda
      const input = cell.querySelector('input');
      const value = input.value;
      
      // Reemplazar el elemento <input> con el valor ingresado
      cell.innerHTML = value;
      
      // Obtener el ID del registro desde el atributo "data-id"
      const id = row.getAttribute('data-id');
      
      // Actualizar el valor en la base de datos
      const updates = {};
      updates['datos/' + id + '/' + cell.getAttribute('data-field')] = value;
      database.ref().update(updates);
    }
  }
  
  // Calcular los valores de la fila "Total"
  calculateTotal(table);
}


// Función para calcular los valores de la fila "Total" en la tabla
function calculateTotal(table) {
  const tbody = table.querySelector('tbody');
  const rows = tbody.rows;
  const totalRow = rows[rows.length - 1];
  let totalUnidades = 0;
  let totalPesos = 0;
  let totalMezcla = 0;
  
  for (let i = 0; i < rows.length - 1; i++) {
    const row = rows[i];
    const unidadesCell = row.cells[1];
    const pesosCell = row.cells[2];
    const mezclaCell = row.cells[3];
    
    totalUnidades += parseInt(unidadesCell.textContent);
    totalPesos += parseInt(pesosCell.textContent.replace(/\$|,/g, ''));
    totalMezcla += parseFloat(mezclaCell.textContent.replace(/\$|,/g, '')) / 3;
  }
  
  // Actualizar los valores en la fila "Total"
  const totalUnidadesCell = totalRow.cells[1];
  const totalPesosCell = totalRow.cells[2];
  const totalMezclaCell =totalRow.cells[3];
  
  totalUnidadesCell.textContent = totalUnidades;
  totalPesosCell.textContent = '$' + totalPesos.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  totalMezclaCell.textContent = '$' + totalMezcla.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
