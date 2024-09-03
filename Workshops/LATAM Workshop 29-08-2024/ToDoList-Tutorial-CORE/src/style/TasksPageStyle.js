import styled from 'styled-components';

export const ItemBackground = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: -50px;
`;

export const ItemContainer = styled.div`
  margin-top: 30px;
  box-sizing: border-box;
  min-width: 320px;
  max-width: 800px;
  width: 100%;
  padding: 0px 32px;
  position: relative;
`;

export const ItemTitle = styled.h3`
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ItemHeader = styled.div`
  background: black;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.6em;
  border-radius: 20px;
  margin: 0px;
  padding: 20px;
  box-shadow: none;
  color: rgb(255, 255, 255);
`;

export const ItemBody = styled.div`
  font-weight: 400;
  font-size: 1em;
  line-height: 1.6em;
  border-radius: 0px 0px 20px 20px;
  margin: -20px 0px 0px;
  padding-inline: 32px;
  padding-top: 32px;
  box-shadow: none;
  background: gray;
  color: black;
`;

export const ItemAddButton = styled.button`
  background: #f54866;
  color: white;
  font-weight: 700;
  padding: 15px 20px;
  border-radius: 1rem;
  border: none;
  margin-right: 10px;
  margin-left: 10px;
  &:hover {
    background: rgb(146, 0, 0);
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  color: black;
`;

export const TableHeader = styled.th`
  background-color: #f54866;
  color: white;
  padding: 10px;
  text-align: center; /* Centra el texto en los encabezados */
  border: 1px solid #ddd;
`;

export const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center; /* Centra el texto en las celdas */
`;

export const TableRow = styled.tr`
   background-color: #f2f2f2;
`;

export const PaginationButton = styled(ItemAddButton)`
  padding: 10px 15px;
  font-size: 14px;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const CompleteButton = styled.button`
  background-color: #007bff; /* Azul para completar */
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #0056b3; /* Azul más oscuro al pasar el ratón */
  }

  &:disabled {
    background-color: #c0c0c0; /* Color gris para deshabilitado */
    cursor: not-allowed;
  }
`;

export const RemoveButton = styled.button`
  background-color: #dc3545; /* Rojo para eliminar */
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #c82333; /* Rojo más oscuro al pasar el ratón */
  }

  &:disabled {
    background-color: #c0c0c0; /* Color gris para deshabilitado */
    cursor: not-allowed;
  }
`;