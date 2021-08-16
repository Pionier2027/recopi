import React, { Component } from 'react';
import axios from 'axios'
import { Button, Spinner } from 'react-bootstrap';
import RecipeContainer from "./RecipeContainer";
import edamam from '../../edamam_conf';

class Menu extends Component {
    state = { 
        // edamam APIで取得した食材リストを配列で保存。
        hits: [],
        // オススメ結果が出るまでスピナーを表示させるかどうか
        isLoading: false,
        // 食材がDB上にない場合、trueに変換。
        noRecommend: false
    }

    // スピナーを作動
    activateSpinner =()=> {
        this.setState({
            // スピナーを作動すると同時に、以前にedamam APIで取得した食材リストを初期化
            hits:[],
            // スピナーが作動
            isLoading:true,
        })
    }

    // スピナーを停止
    deactivateSpinner =()=> {
        this.setState({isLoading:false})
    }

    fetchIngredients = () => {
        // スピナーを作動。
        this.activateSpinner()
        // axiosによりDBから判定結果を確保
        axios.get('http://127.0.0.1:8000/api/images/', {
            headers: {
                'accept': 'application/json',
            }  
        })
        .then(resp=>{
            // 判定結果データの中からデータのインスタンス配列を保存。
            let ingrs = resp.data
            // console.log(ingrs.slice(ingrs.length-3, ingrs.length))
            // 保存データが３つ以上ある場合は古い順に食材を組み合わせて献立をオススメ
            if (ingrs.length >=3 ) {
                this.fetchRecipes(ingrs.slice(ingrs.length-3, ingrs.length))
            // データが２つの場合は２つの組み合わせで献立をオススメ
            } else if (ingrs.length === 2) {
                this.fetchRecipes(ingrs.slice(ingrs.length-2, ingrs.length))
            // データが１つしかない場合、その食材で献立をオススメ
            } else if (ingrs.length === 1) {
                this.fetchRecipes(ingrs.slice(ingrs.length-1, ingrs.length))
            // データが存在しない（冷蔵庫に保管中の食材がない場合）、画面にレシピを表示しない。
            } else {
                // 0.5秒待機
                setTimeout(() => {
                    // スピナーを停止
                    this.deactivateSpinner()
                    this.setState({
                        // レシピのオススメができないメッセージを表示
                        noRecommend: true
                    })
                }, 500);
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    fetchRecipes = (ingrs) => {
        // Edamam APIに飛ばす為の食材名を保存する変数
        let name = "";
        // ingrs配列に保存されている判定食材名を","で繋げる。
        ingrs.forEach(element => {
            name += element.classified
            name += `,`
        });
        console.log(name)
        // edamam APIに飛ばす情報も合わせてGET要請(../../edamam_conf.jsファイルを参照。)
        axios.get(`https://api.edamam.com/search?q=${name}&ingr=${edamam.ingr}&time=${edamam.time}&app_id=${edamam.app_id}&app_key=${edamam.app_key}`)
        .then(resp=>{
            // edamam APIで取得した食材リストをstateのhitsに保存。
            this.setState({hits: resp.data.hits})
        })
        .catch(err=>{
            console.log(err)
        })
        // 0.5待機し、スピナーを停止
        setTimeout(() => {
            this.deactivateSpinner()
        }, 500)
        
    }

    render() { 
        return ( 
            <div>
                {/* オススメの献立の一覧を表示させるためのボタン。イベントハンドラも要確認 */}
                <Button variant='info' size='lg' className='mt-3' onClick={this.fetchIngredients}>Recommend Menu</Button>
                <br />
                {/* 献立を読み込み中にスピナーを表示 */}
                {this.state.isLoading && 
                    <Spinner animation="border" role="status" style={{marginTop: '25px'}}></Spinner>
                }
                {/* Recommend Menuボタンを押して、DBからデータを取得した際に献立一覧を表示。表示内容は./RecipeContainer.jsに関数コンポーネントとして定義。 */}
                {this.state.hits.length >0  ?
                    <RecipeContainer hits={this.state.hits} />
                // DB上に保存食材データが存在しない場合、画面に以下のメッセージを表示
                : this.state.noRecommend &&
                <h3 className="mb-3" style={{paddingTop: '25px'}}>There's no enough numbers of ingredients to show recommendation</h3>
                }
            </div>
        );
    }
}
 
export default Menu;