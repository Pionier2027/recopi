import React, { Component } from 'react';
import axios from 'axios'
import Image from './Image';
import { Button, Row, Spinner } from 'react-bootstrap';

// メインタブの２つ目のページ。DB上の判定結果を閲覧するためのクラスコンポーネント
class ImageList extends Component {
    state = {
        // DB上の判定結果リストを保存
        images: [],
        // 表示される判定結果の数
        visible: 3,
        // ページを開いた際にスピナーを表示するかどうか
        isLoading: true,
        // より多くの食材を表示する際にスピナーを表示するかどうか
        newLoaded: false,
        // DBから画像を確保したかどうか
        status: false,
    }
    
    //　1秒待機後にDB上の判定結果を表示
    componentDidMount() {
        setTimeout(this.getImages, 1000)
    }

    // axiosによりRestAPIにアクセス
    getImages = () =>{
        axios.get('http://127.0.0.1:8000/api/images/', {
           headers: {
               'accept': 'application/json'
           }
        }).then(resp=>{
            this.setState({
                // DBから受け取った判定結果リストを保存
                images: resp.data,
                //　DBからの判定結果読み込み完了
                status: true,
            })
            console.log(resp)
       })
    //    スピナーを停止
       this.setState({isLoading:false})
   }

//    Load moreボタンを押したイベントのハンドラを定義
   handleVisible =()=>{
        // 画面上に一度に表示する食材数
        const visible = this.state.visible
        // クリックする度に見える食材の数を一定数個ずつ増やす
        const new_visibile = visible + visible
        // スピナーを表示
        this.setState({newLoaded:true})
        // 0.3秒待機
        setTimeout(() => {
            this.setState({
                // 食材の合計表示数を一定数個増やした状態に更新
                visible: new_visibile,
                // スピナーを停止
                newLoaded:false,
            })
        }, 300);
    }

    render() {
        // データベース上の判定結果をそれぞれ個別のコンポーネントとしてvisibleの長さ分画面に表示。
        // 表示内容は./Image.jsに定義されている関数コンポーネントを参照。
        const images = this.state.images.slice(0, this.state.visible).map(img=>{
            return <Image key={img.id} pic={img.picture} name={img.classified}/>
        })
        return ( 
            <div>
                {/* 読み込み中かどうか */}
                {this.state.isLoading ?
                // 読み込み中であればスピナーを表示
                <Spinner animation="border" role="status"></Spinner>
                : 
                    <React.Fragment>
                        {/* DBから判定結果を読み込んだがデータが存在しない場合 */}
                        {((this.state.images.length === 0) && (this.state.status)) &&
                        <h3>No images classified</h3>
                        }
                        {/* イメージコンポーネントをリストとして表示 */}
                        <Row xs={1} md={3} className="g-4">
                            {images}
                        </Row>
                        {/* 追加で食材を表示する際、待機中にスピナー表示 */}
                        {this.state.newLoaded &&
                        <Spinner animation="border" role="status"></Spinner>
                        }
                        <br />
                        {/* まだ表示し切っていない画像が残っている場合、Load moreボタンを表示。イベントハンドラも要確認。 */}
                        {this.state.images.length > this.state.visible &&
                        <Button className="mb-3" variant='primary' size='lg' onClick={this.handleVisible}>Load more</Button>
                        }
                        {/* 食材がDB上に１つ以上存在している状態で画面上に全ての食材を表示し切った場合 */}
                        {((this.state.images.length <= this.state.visible) && (this.state.images.length>0)) &&
                        <h3 className="mb-3">no more images to load</h3>
                        }
                    </React.Fragment>
                }
            </div>
         );
    }
}
 
export default ImageList;