/* =========================================================
   MOMO · 游戏数据：装扮、家具、食物、关卡、回忆、任务
   ========================================================= */
const DATA = {
  WARDROBE: {
    head: [
      { id: 'bow_coral', name: '珊瑚蝴蝶结', sub: '甜甜的小心思', price: 120 },
      { id: 'beret', name: '复古贝雷帽', sub: '小画家出门啦', price: 180 },
      { id: 'flower_crown', name: '雏菊花环', sub: '草地野餐限定', price: 0, reward: 3 },
      { id: 'berry_hat', name: '草莓小帽', sub: '酸酸甜甜', price: 220 },
      { id: 'straw_hat', name: '田园草帽', sub: '夏天的味道', price: 260 },
      { id: 'party_hat', name: '派对尖尖帽', sub: '今天是好日子', price: 150 },
      { id: 'star_crown', name: '星光王冠', sub: '许愿星的礼物', price: 0, reward: 9 },
    ],
    neck: [
      { id: 'scarf_mint', name: '薄荷围巾', sub: '软软暖暖', price: 0 },
      { id: 'scarf_lav', name: '薰衣草围巾', sub: '淡淡紫色梦', price: 150 },
      { id: 'scarf_berry', name: '莓果围巾', sub: '粉嘟嘟', price: 150 },
      { id: 'bowtie', name: '波点领结', sub: '小绅士必备', price: 100 },
      { id: 'cape', name: '奶油披肩', sub: '像一朵云', price: 240 },
      { id: 'bell', name: '叮当铃铛', sub: '走路叮叮当', price: 160 },
    ],
    face: [
      { id: 'glasses', name: '圆框眼镜', sub: '文艺小兔', price: 140 },
      { id: 'sticker', name: '星星贴纸', sub: '闪闪发光', price: 80 },
      { id: 'hearts', name: '爱心腮红', sub: '害羞的时候', price: 90 },
      { id: 'shades', name: '爱心墨镜', sub: '酷酷的', price: 200 },
    ],
  },
  ROOM: {
    seat: { label: '座椅', items: [
      { id: 'seat_beanbag', name: '奶油豆袋', price: 0 }, { id: 'seat_arm', name: '复古沙发椅', price: 260 },
      { id: 'seat_mush', name: '蘑菇小凳', price: 120 }, { id: 'seat_cloud', name: '云朵沙发', price: 300 }] },
    rug: { label: '地毯', items: [
      { id: 'rug_round', name: '蜜桃圆毯', price: 0 }, { id: 'rug_plaid', name: '格纹野餐毯', price: 140 },
      { id: 'rug_cloud', name: '云朵地毯', price: 180 }, { id: 'rug_berry', name: '草莓地毯', price: 160 }] },
    lamp: { label: '灯', items: [
      { id: 'lamp_floor', name: '暖光落地灯', price: 0 }, { id: 'lamp_mush', name: '蘑菇夜灯', price: 0, reward: 6 },
      { id: 'lamp_string', name: '星星串灯', price: 200 }, { id: 'lamp_moon', name: '月亮灯', price: 240 }] },
    plant: { label: '绿植', items: [
      { id: 'plant_monstera', name: '龟背竹', price: 0 }, { id: 'plant_tulip', name: '郁金香', price: 120 },
      { id: 'plant_cactus', name: '微笑仙人掌', price: 90 }, { id: 'plant_pothos', name: '垂吊绿萝', price: 150 }] },
    deco: { label: '墙饰', items: [
      { id: 'deco_frame', name: '爪印相框', price: 0 }, { id: 'deco_clock', name: '复古挂钟', price: 140 },
      { id: 'deco_shelf', name: '小书架', price: 200 }, { id: 'deco_record', name: '唱片机', price: 260 },
      { id: 'deco_bunting', name: '彩旗派对', price: 120 }] },
    wall: { label: '墙纸', items: [
      { id: 'wall_cream', name: '奶油墙', price: 0 }, { id: 'wall_floral', name: '碎花墙纸', price: 160 },
      { id: 'wall_stripe', name: '复古条纹', price: 160 }, { id: 'wall_night', name: '星夜墙纸', price: 220 }] },
    window: { label: '窗景', items: [
      { id: 'win_sunset', name: '晚霞', price: 0 }, { id: 'win_sakura', name: '樱花', price: 180 },
      { id: 'win_rain', name: '雨天', price: 120 }, { id: 'win_night', name: '星空', price: 200 }] },
  },
  ROOM_TABS: [
    { id: 'furn', name: '家具', slots: ['seat', 'rug', 'lamp'] },
    { id: 'deco', name: '装饰', slots: ['plant', 'deco'] },
    { id: 'vibe', name: '氛围', slots: ['wall', 'window'] },
  ],
  FOODS: [
    { id: 'carrot', name: '胡萝卜', price: 10, hunger: 18, mood: 3, xp: 4 },
    { id: 'strawberry', name: '草莓', price: 15, hunger: 12, mood: 8, xp: 5 },
    { id: 'clover', name: '三叶草', price: 8, hunger: 10, mood: 2, energy: 4, xp: 3 },
    { id: 'cupcake', name: '小蛋糕', price: 30, hunger: 24, mood: 16, xp: 8 },
  ],
  ZONES: [
    { id: 'meadow', name: '雏菊草地', en: 'Daisy Meadow' },
    { id: 'forest', name: '蘑菇森林', en: 'Mushroom Woods' },
    { id: 'pond', name: '星光池塘', en: 'Starlight Pond' },
  ],
  LEVELS: [
    { id: 1, zone: 'meadow', name: '第一次出门', desc: '天上掉胡萝卜啦！用篮子接住它们，小心石头。', game: 'catch', time: 30, p: { rate: .85, speed: 150, bad: .12 }, goals: [8, 14, 20], coins: 40 },
    { id: 2, zone: 'meadow', name: '雏菊小径', desc: '萝卜田里冒出了好多小萝卜，快拔！别碰小蜜蜂。', game: 'pull', time: 30, p: { life: 1350, rate: 780, bee: .16 }, goals: [10, 16, 22], coins: 50 },
    { id: 3, zone: 'meadow', name: '野餐篮的秘密', desc: '野餐篮里的点心被打乱了，翻开卡片配成对。', game: 'memory', time: 60, p: { pairs: 6 }, coins: 60, gift: 'flower_crown' },
    { id: 4, zone: 'forest', name: '蘑菇雨', desc: '森林里下起了零食雨！刺刺栗子要躲开哦。', game: 'catch', time: 30, p: { rate: .66, speed: 190, bad: .2 }, goals: [12, 20, 28], coins: 70 },
    { id: 5, zone: 'forest', name: '松鼠的谜题', desc: '小松鼠藏了好多宝贝，你能记住它们的位置吗？', game: 'memory', time: 75, p: { pairs: 8 }, coins: 80 },
    { id: 6, zone: 'forest', name: '萤火虫小路', desc: '跟着萤火虫的光，把冒出来的萝卜都拔出来。', game: 'pull', time: 30, p: { life: 1080, rate: 640, bee: .22 }, goals: [14, 22, 30], coins: 90, gift: 'lamp_mush' },
    { id: 7, zone: 'pond', name: '荷叶跳跳', desc: '池塘边的夜风吹落好多果子，越来越快啦！', game: 'catch', time: 30, p: { rate: .52, speed: 235, bad: .26 }, goals: [16, 26, 36], coins: 100 },
    { id: 8, zone: 'pond', name: '池塘倒影', desc: '水面上的倒影一闪一闪，记忆力大考验。', game: 'memory', time: 60, p: { pairs: 8 }, coins: 110 },
    { id: 9, zone: 'pond', name: '许愿星', desc: '最后的挑战！拔出所有萝卜，向流星许个愿吧。', game: 'pull', time: 30, p: { life: 860, rate: 520, bee: .28 }, goals: [18, 28, 38], coins: 150, gift: 'star_crown' },
  ],
  GAMES: {
    catch: { name: '萝卜雨', en: 'Carrot Rain', desc: '左右拖动接住掉下来的零食', icon: 'carrot' },
    pull: { name: '拔萝卜', en: 'Pull! Pull!', desc: '点击冒出来的萝卜，躲开蜜蜂', icon: 'bee' },
    memory: { name: '记忆翻翻乐', en: 'Memory', desc: '翻开卡片找出相同的一对', icon: 'mushroom' },
  },
  MOMENTS: [
    { id: 'hello', cat: 'mile', title: '初次见面', desc: '你好呀！从今天起，我们就是最好的朋友啦。', scene: 'home', expr: 'happy', hint: '开始游戏' },
    { id: 'firstfeed', cat: 'mile', title: '第一口胡萝卜', desc: '咔嚓咔嚓～原来被人喂饭是这么幸福的事。', scene: 'room', expr: 'eat', hint: '第一次喂食' },
    { id: 'bath', cat: 'mile', title: '泡泡浴时光', desc: '泡泡飞呀飞，毛毛变成了香喷喷的小团子。', scene: 'bath', expr: 'happy', hint: '洗一次泡泡澡' },
    { id: 'newlook', cat: 'mile', title: '新造型登场', desc: '镜子里的自己，好像更可爱了一点点？', scene: 'boutique', expr: 'wink', hint: '换上新的装扮' },
    { id: 'sleep', cat: 'mile', title: '晚安，好梦', desc: '今晚的梦里，有一整片胡萝卜田。', scene: 'night', expr: 'sleep', hint: '哄毛毛睡一觉' },
    { id: 'cozy', cat: 'mile', title: '温暖的小窝', desc: '一点点布置起来的家，每个角落都是我们的。', scene: 'room', expr: 'happy', hint: '布置小窝 5 次' },
    { id: 'lv3', cat: 'mile', title: '长大了一点点', desc: '谢谢你一直陪着我，我们一起慢慢长大吧。', scene: 'party', expr: 'love', hint: '达到 Lv.3' },
    { id: 'tasks', cat: 'mile', title: '元气满满的一天', desc: '今天的小事都完成啦，给自己一个大大的拥抱！', scene: 'meadow', expr: 'happy', hint: '完成全部每日任务' },
    { id: 'meadow', cat: 'adv', title: '草地野餐', desc: '雏菊、阳光和一篮子胡萝卜，是春天的味道。', scene: 'meadow', expr: 'happy', hint: '通关「雏菊草地」' },
    { id: 'forest', cat: 'adv', title: '蘑菇森林探险', desc: '森林深处的蘑菇会发光，原来是萤火虫在跳舞。', scene: 'forest', expr: 'surprised', hint: '通关「蘑菇森林」' },
    { id: 'pond', cat: 'adv', title: '星光下的愿望', desc: '我许的愿望是：明天也和你在一起。', scene: 'pond', expr: 'love', hint: '通关「星光池塘」' },
    { id: 'allstar', cat: 'adv', title: '满天星星', desc: '27 颗星星，每一颗都是我们一起努力的证明。', scene: 'night', expr: 'love', hint: '收集全部 27 颗星' },
  ],
  TASKS: [
    { id: 'pet', name: '摸摸毛毛的头', sub: '点一点或者轻轻搓搓它', goal: 3, icon: 'sun', coins: 20, go: 'home' },
    { id: 'feed', name: '喂毛毛吃饭', sub: '把食物拖到它的嘴边', goal: 2, icon: 'bowl', coins: 20, go: 'feed' },
    { id: 'play', name: '陪它玩一会儿', sub: '任意小游戏玩一局', goal: 1, icon: 'game', coins: 30, go: 'play' },
    { id: 'adventure', name: '完成一次冒险', sub: '在冒险地图上通关一次', goal: 1, icon: 'compass', coins: 40, go: 'adventure' },
    { id: 'bath', name: '洗个泡泡澡', sub: '戳破所有的泡泡', goal: 1, icon: 'bath', coins: 20, go: 'bath' },
    { id: 'photo', name: '拍一张合照', sub: '记录今天的小时光', goal: 1, icon: 'camera', coins: 20, go: 'photo' },
  ],
  LINES: {
    tap: ['嘿嘿～', '今天也最喜欢你啦！', '摸摸头～', '要不要一起去冒险？', '咕噜咕噜～', '你来啦！', '我在这儿呢～', '嘻嘻，好痒！', '想要一根胡萝卜…'],
    rub: ['好舒服呀～', '再摸摸嘛～', '呼噜噜…', '最喜欢被摸摸了'],
    hungry: ['肚子咕咕叫了…', '想吃胡萝卜…', '有点饿饿的'],
    tired: ['有点困了…', '眼皮好重哦…'],
    dirty: ['身上痒痒的…', '想洗泡泡澡！'],
    full: ['吃不下啦～', '肚子圆滚滚的！'],
    sad: ['陪陪我好不好…'],
  },
};
