<template>
    <div class="container">
        <div class="flex-center">
            <h1>下载</h1>
            <p class="text-center ">
                这里有一些我开发的一些应用,它们是开源并且免费的,如果在使用的过程中发现一些BUG,或者有新的建议,请在Github留言给我。
            </p>
        </div>
        <div>
            <ul class="list">
                <li class="type-item">
                    <h2>Android</h2>
                    <ul class="type-list">

                        <li>
                            <h5>即时通信</h5>
                            <p>这是一个简介</p>
                            <div class="bottom">
                                <a class="source" href="">Github</a>
                                <a class="download" href="">下载</a>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { listSoftware } from "../apis/blog";

</script>
<style lang="less" scoped>
.flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

* {
    padding: 0px;
    margin: 0px;
}

a {
    color: #2c3e50;
    text-decoration: none;
}

.container {
    padding-top: 40px;
    min-width: 1300px;
    width: 1300px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    color: #2c3e50;

    .type-item {
        margin-top: 40px;
    }

    .type-list {
        margin-top: 10px;
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(4, 325px);

        li {
            border-right: 1px #e7e7e7 solid;
            padding: 25px 35px;
        }

        p {
            height: 140px;
            font-size: 13px;
        }

        a {
            background: #f3f3f3;
            padding: 5px 15px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            cursor: pointer;

        }

        .bottom {
            display: flex;
            justify-content: space-between;
        }

        a.source {}
    }

    .text-center {
        text-align: center;
        max-width: 800px;
        margin-top: 20px;
    }

    h1 {
        text-align: center;
    }
}
</style>