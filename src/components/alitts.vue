<template>
  <div id="alitts_data">
    <div class="alitts_data" v-if="ttsValue"></div>
    <textarea rows="3" cols="20" v-model="text"></textarea><br>
    <button @click="testTtsApi">点击查看接口数据</button>
    <div>
      responseData==><br>
      {{responseData}}
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { AMSound } from "../sound/sound";
  import {mapActions, mapGetters} from "vuex";
  export default {
    name:"alitts",
    computed: {
      ...mapGetters([
        "ali_tts_token",
        "ali_token_expires",
      ])
    },
    data(){
      return{
        ttsValue:false,
        responseData:'',
        text:'',
      }
    },
    created() {
      if(this.$route.query.text){
        this.text = this.$route.query.text;
        let _data = this.$route.query
        this.getAudio(_data.text,_data.speechRate,_data.volume,_data.voiceName,_data.pitchRate)
      }
    },
    mounted() {


    },
    methods:{
      ...mapActions(["fetchSoundToken"]),

      testTtsApi(){
        axios({
          url:'http://127.0.0.1:3000/CMU/getALITTS',
          method:'post',
          data:{
            text:this.text,
            speechRate:-140,
            volume:50,
            voiceName:'Aixia',
            pitchRate:0
          }
        }).then(res=>{
          let Base64 = require('js-base64').Base64;
          console.log(res.data)
          this.responseData = res.data
        })
      },
      initSound() {
        this.AMSound = new AMSound();
        let _option = {
            user_id: '726',
            access_token : this.ali_tts_token
          },
          _isInitInacTTS = false;

        this.AMSound.init('ali', _option, _isInitInacTTS);
      },
      async getAudio(_text,_speechRate,_volume,_voiceName,_pitchRate) {
        if (!this.AMSound) {
          this.initSound();
        }
        let time = new Date().getTime()
        if (!this.ali_tts_token || time > this.ali_token_expires) {
          console.log('获取阿里TTS token')
          await this.fetchSoundToken({ type: 'ali' })
          await this.AMSound.refreshToken(this.ali_tts_token);
        }

        await this.AMSound.txtToAudio({
          text: _text,

          tts: {
            speechRate: Number(_speechRate) || -140, //-140 语速，取值范围 -500 ~ 500
            volume:Number(_volume) || 50, //50 音量，取值范围 0 ~ 100
            voiceName: _voiceName || "Aixia",//"Aixia"
            pitchRate:Number(_pitchRate) || 0, //0 语调，取值范围 -500 ~ 500
          },

          isHandleTimeline: true
        })
        this.ttsValue = true;
        window.currentWordsTimeArr = this.AMSound.TTS.audioInfo[0].currentWordsTimeArr
        let _a = this.AMSound.TTS.audioInfo[0].audio_buffer
        let Base64 = require('js-base64').Base64;
        window.base64_audio = 'data:audio/mp3;base64,'+Base64.encode(_a)
        this.ab2str(_a,function(str){
          //str为字符串
          console.log("str------",str)
          window.audio_buffer_str = str
        });
      },
      //ArrayBuffer转字符串
      ab2str(u,f) {
        var b = new Blob([u]);
        var r = new FileReader();
        r.readAsText(b, 'utf-8');
        r.onload = function (){if(f)f.call(null,r.result)}
      },
    }
  }
</script>

