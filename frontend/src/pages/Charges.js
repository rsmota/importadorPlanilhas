import React, { Component } from 'react';
import api from '../services/api';
import Dropzone from 'react-dropzone';
const FileDownload = require('js-file-download');

export default class Charges extends Component {
    sendRequest = async (files) => {
        const data = new FormData();
        files.forEach((file) => {
            data.append('files', file);
        });

        try {
            await api.post(`/uploadCharges`, data).then((response) => {
                if (response.status >= 500) {
                    this.setState({
                        hasError: true,
                        errorMsg: response.data,
                    });
                } else {
                    FileDownload(response.data, 'cobranca.csv');
                }
            });
        }
        catch (err) {
            return;
        }
    }

    deleteFile = async () => {
        try {
            await api.post(`/charges?1`).then((response) => {
                console.log(response.data);
                if (response.status >= 300) {
                    this.setState({
                        hasError: true,
                        errorMsg: response.data,
                    });
                } else {
                    console.log(response);
                }
            });
        }
        catch (err) {
            return;
        }
    }

    constructor(props) {
        super(props);

        this.sendRequest = this.sendRequest.bind(this);
        this.deleteFile = this.deleteFile.bind(this);

        this.state = {
            files: [],
            hasError: false,
            errorMsg: '',
        }
    }

    render() {
        return (
            <div>
                <Dropzone onDrop={this.sendRequest}>
                    { ({ getRootProps, getInputProps }) => (
                        <div className="form-input" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Arraste arquivos ou clique aqui</p>
                        </div>
                    )}
                </Dropzone>
                <a href="/" className="btn btn-info">Voltar</a>
                <a href="/charges" onClick={this.deleteFile} className="btn btn-danger">Deletar arquivo</a>
                {(this.state.hasError) ?
                    <div className="alert alert-danger">{this.state.errorMsg}</div>
                    : <div></div>
                }
            </div>
        );
    }
}
