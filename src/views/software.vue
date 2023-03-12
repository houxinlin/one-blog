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
                <template v-for="(value, key) in state.list" :key="value">
                    <li class="type-item">
                        <h2>{{ key }}</h2>
                        <ul class="type-list">
                            <template v-for="(software) in value" :key="software.index">
                                <li>
                                    <h4>{{ software.softwareName }}</h4>
                                    <p>{{ software.softwareDescribe }}</p>
                                    <a target="_block" :href="'http://www.houxinlin.com/res' + software.gifPath">
                                        <img :src="'http://www.houxinlin.com/res' + software.gifPath">
                                    </a>
                                    <div class="bottom">
                                        <a target="_block" class="source btn" :href="software.githubUrl">Github</a>
                                        <a target="_block" class="download btn" :href="software.binUrl">下载</a>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </li>
                </template>


            </ul>
        </div>
    </div>
</template>
<script setup>
import { listSoftware } from "../apis/blog";
import { reactive, onMounted } from "vue";
let state = reactive({
    list: false,
});

onMounted(() => {
    listSoftware().then((res) => {
        state.list = res.data;
    })
})
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
            font-size: 13px;
            margin-top: 5px;
            max-height: 70px;
            height: 61px;
        }

        a.btn {
            background: #f3f3f3;
            padding: 4px 8px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 13px;

        }

        img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            margin-top: 5px;
        }

        .bottom {
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
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