<template>
  <div class="map">
    <div id="container" style="width: 100%; height: 100%" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"

onMounted(async () => {
  // 创建地图实例
  const map = new AMap.Map("container", {
    zoom: 14,
    resizeEnable: true
  })

  map.plugin("AMap.Geolocation", function () {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true, // 是否使用高精度定位，默认：true
      timeout: 10000, // 设置定位超时时间，默认：无穷大
      offset: [10, 20], // 定位按钮的停靠位置的偏移量
      zoomToAccuracy: true, //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      position: "RB" //  定位按钮的排放位置,  RB表示右下
    })

    geolocation.getCurrentPosition(function (status, result) {
      if (status == "complete") {
        onComplete(result)
      } else {
        onError(result)
      }
    })

    function onComplete(data) {
      // data是具体的定位信息
    }

    function onError(data) {
      // 定位出错
    }
  })
})
</script>

<style scoped lang="scss">
.map {
  height: 500px;
  width: 500px;
}
</style>
