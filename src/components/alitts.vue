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
        this.getAudio(_data.text,_data.speechRate,_data.volume,_data.voiceName,_data.pitchRate,_data.format)
      }
    },
    mounted() {


    },
    methods:{
      ...mapActions(["fetchSoundToken"]),

      testTtsApi(){
        let Base64 = require('js-base64').Base64;
        console.log(Base64.encode('大家好'))
        axios({
          // responseType:'blob',
          // headers:{
          //   'Content-Type':'audio/mp3'
          // },
          url:'http://39.106.142.30:3000/CMU/getALITTS',
          method:'post',
          data:{
            text:this.text,
            speechRate:-140,
            volume:50,
            voiceName:'Aixia',
            pitchRate:0,
            format:'wav'
          }
        }).then(res=>{
          console.log('res.data',res.data)
          this.responseData = res.data
          window.ceshi = res.data
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

      async getAudio(_text,_speechRate,_volume,_voiceName,_pitchRate,_format) {
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
            format:_format ||'wav'
          },

          isHandleTimeline: true
        })
        this.ttsValue = true;
        window.currentWordsTimeArr = this.AMSound.TTS.audioInfo[0].currentWordsTimeArr
        let _a = this.AMSound.TTS.audioInfo[0].audio_buffer
        console.log(_a)
        let Base64 = require('js-base64').Base64;
        // window.base64_audio = 'data:audio/wav;base64,'+Base64.encode(_a)

        window.base64_audio = Base64.fromUint8Array(this.abcopy(new Uint8Array(_a)))

        // for (let i = 0 ; i<10 ;i++){
        //    new DataView(_a.buffer).getUint8(i)
        // }

        window.arraybuffer_audio = _a;

        window.audio_buffer_str = this.ab2str(_a)
      },
      //ArrayBuffer转字符串
      ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
      },
      abcopy(buffer) {
        var bytes = new Uint8Array(buffer);
        var output = new ArrayBuffer(buffer.byteLength);
        var outputBytes = new Uint8Array(output);
        for (var i = 0; i < bytes.length; i++)
          outputBytes[i] = bytes[i];
        return output;
      },

    }
  }
</script>

