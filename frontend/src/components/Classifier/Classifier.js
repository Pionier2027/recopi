import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './Classifier.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert, Button, Image, Spinner} from 'react-bootstrap';
import axios from 'axios';
import Webcam from 'react-webcam';

class Classifier extends Component {
    state = { 
        // 現在変数として保存されている画像ファイル
        files: [],
        // スピナーを表示するかどうか
        isLoading: false,
        // 判定後のイメージデータを保存
        recentImage: null,
        // ウェブカメラの撮影ボタンを表示。
        showButton: false
    }

    //　1.7秒待機後にウェブカメラの撮影ボタンを表示。
    componentDidMount() {
        setTimeout(() => {
            this.setState({showButton: true})
        }, 1700);
    }

    // ------------------------------------------------
    // 画像ファイルをドラッグアンドドロップした際
    onDrop =(files)=>{
        // スピナー作動。
        this.setState({
            files:[],
            isLoading: true, 
            recentImage: null,
            })
        this.loadImage(files)
    }

    loadImage=(files)=>{
        setTimeout(() => {
            // 1秒待機。その間スピナーを表示。
            this.setState({
                files,
                isLoading: false
            }, () => {
                // コンソール上でファイル名を確認
                console.log(this.state.files[0].name)
            })
        }, 1000);
    }
    // ------------------------------------------------


    // ------------------------------------------------
    activateSpinner =()=> {
        this.setState({
            files:[],
            isLoading:true,
        })
    }

    deactivateSpinner =()=> {
        this.setState({isLoading:false})
    }

    sendImage =()=>{
        // スピナー作動。
        this.activateSpinner()
        // バックエンドに送るデータを保存するためのオブジェクト
        let formData = new FormData()
        console.log(this.state.files[0].name)
        console.log(this.state.files[0])
        // ('フィールド名’、　DB上に保存されるレコード（Blobオブジェクト）、　ファイル名)
        formData.append('picture', this.state.files[0], this.state.files[0].name)
        console.log(formData.getAll('picture'))
        console.log(formData)
        // ポストメソッドでバックエンドにデータを送信
        axios.post('http://127.0.0.1:8000/api/images/', formData, {
            headers: {
                'accept': 'application/json',
                'content-type': 'multipart/form-data'
            }
        })
        .then(resp=>{
            // 送信してDBに保存したデータをフェッチ。
            this.getImageClass(resp)
            console.log(resp.data.id)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    getImageClass =(obj)=> {
        // idを用いてバックエンドからデータを取得
        axios.get(`http://127.0.0.1:8000/api/images/${obj.data.id}/`, {
            headers: {
                'accept': 'application/json',
            }
        })
        .then(resp=>{
            // 確保したイメージファイルを保存
            this.setState({recentImage:resp})
            console.log("getimage", resp)
        })
        .catch(err=>{
            console.log(err)
        })
        // スピナー停止
        this.deactivateSpinner()
    }
    // ------------------------------------------------

    // ウェブカメラオブジェクトを属性として保存
    setRef = (webcam) => {
        this.webcam = webcam;
    }

    // イメージファイルをバイナリ化し、Blobオブジェクトとして変換
    dataURLtoBlob = (dataurl) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    screenShot = () => {
        // スクリーンショットした画像をオブジェクトとして保存
        const imageSrc = this.webcam.getScreenshot();
        // 画像をBlob形式としてバイナリ化
        const blob = this.dataURLtoBlob(imageSrc);
        // 時間_分_秒.jpg
        var today = new Date(),
            time = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds() + ".jpg";
        // Blogオブジェクトの属性を定義
        const myFile = this.blobToFile(blob, time);
        this.setState({files:[]})
        this.state.files.push(myFile);
        this.sendImage();
    }

    // Blobオブジェクトの属性を定義
    blobToFile = (theBlob, fileName) => {
        // Dateオブジェクト
        theBlob.lastModifiedDate = new Date();
        // ファイル名
        theBlob.name = fileName;
        // theBlob.path = fileName;
        // theBlob.webkitRelativePath = "";
        return theBlob;
    }

    render() {
        // アップロードしたファイルの名前とバイト数をマッピング
        const files = this.state.files.map(file => (
            <li key={file.name}>
              {file.name} - {file.size} bytes
            </li>
        ));
        return ( 
            <div>
            {/* ドロップゾーンを表示 */}
            <Dropzone onDrop={this.onDrop} accept='image/png, image/jpeg'> 
            {({isDragActive, getRootProps, getInputProps}) => (
                <section className="container">
                    <div {...getRootProps({className: 'dropzone back'})}>
                        <input {...getInputProps()} />
                        <i className="far fa-image mb-2 text-muted" style={{fontSize:100}}></i>
                        <p className='text-muted'>{isDragActive ? "Drop some images" : "Drag 'n' drop some files here, or click to select files"}</p>
                    </div>
                    {/* ファイルの名前とバイト数を表示 */}
                    <aside>
                        {files}
                    </aside>

                    {/* イメージファイルがアップロードされていた場合、Select Imageボタンを表示 */}
                    {this.state.files.length > 0 &&
                    <Button variant='info' size='lg' className='mt-3' onClick={this.sendImage}>Select Image</Button>
                    }

                    {/* スピナー表示 */}
                    {this.state.isLoading && 
                    <Spinner animation="border" role="status"></Spinner>
                    }

                    {/* 判定されたイメージがある場合 */}
                    {this.state.recentImage &&
                    <React.Fragment>
                        {/* 判定結果を画面に表示 */}
                        <Alert variant='primary'>
                            {this.state.recentImage.data.classified}
                        </Alert>
                        {/* 判定した画像を画面に表示 */}
                        <Image className='justify-content-center' src={this.state.recentImage.data.picture} height='200' rounded/>
                    </React.Fragment>
                    }
                </section>
            )}
            </Dropzone>
            {/* ウェブカメラ撮影ボタンを一定時間待機後に表示。 */}
            {this.state.showButton &&
            <Button variant='info' size='lg' className='mt-3' onClick={this.screenShot} style={{marginBottom: '25px'}}>Take a picture</Button>
            }
            <br></br>
            <Webcam
                // 音声無効
                audio = {false}
                // ウェブカメラオブジェクトを保存するためのメソッドをバインディング
                ref = {this.setRef}
                // イメージの拡張子をjpegに設定（pngより軽いので）
                screenshotFormat="image/jpeg"
            />
            </div>
        );
    }
}
 
export default Classifier;