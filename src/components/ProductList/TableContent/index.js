//Products page
import React, {Component} from "react";
import {TableData, TableAction} from "../../../styles/tableStyles";
import {LinkButton, ButtonDelete} from '../../../styles/styles';
import {MdDelete, MdEdit, MdRemoveRedEye} from 'react-icons/md';
import {getStringFloat, getStringDate} from '../../../rules';

class TableContent extends Component {
    render() {
        return (
            <tbody>
                {this.props.products.map(product => (
                    // Set table data from products array
                    <tr key={product._id} id={product._id} >
                        <TableData>{product.name}</TableData>
                        <TableData>{getStringFloat(product.price)}</TableData>
                        <TableData>{product.multiple}</TableData>
                        <TableData>{getStringDate(product.createdAt)}</TableData>

                        {/* Action buttons for product */}
                        <TableAction style={{display: 'flex', justifyContent: 'space-evenly'}}>
                            <LinkButton to={`/products/${product._id}`} title="Abrir"><MdRemoveRedEye className="TableButton"/></LinkButton>
                            <LinkButton to={`/products/edit/${product._id}`} title="Editar"><MdEdit className="TableButton"/></LinkButton>
                            <ButtonDelete onClick={()=>{this.props.onDelete(product._id)}} title="Excluir"><MdDelete/></ButtonDelete>
                        </TableAction>
                    </tr>
                ))}
            </tbody>
        );
    }
}

export default TableContent;