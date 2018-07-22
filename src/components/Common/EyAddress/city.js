
const city = (isSearch = false) => {
  let provinces = ["北京", "天津", "上海", "重庆", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西", "海南", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "香港", "澳门", "台湾"];

  let citys = {
    "0": ["东城", "西城", "崇文", "宣武", "朝阳", "丰台", "石景山", "海淀", "门头沟", "房山", "通州", "顺义", "昌平", "大兴", "怀柔", "平谷", "密云县", "延庆县", "延庆镇"],
    "1": ["和平", "河东", "河西", "南开", "河北", "红桥", "塘沽", "汉沽", "大港", "东丽", "西青", "津南", "北辰", "武清", "宝坻", "蓟县", "宁河县", "芦台镇", "静海县", "静海镇", '滨海新区'],
    "2": ["黄浦", "卢湾", "徐汇", "长宁", "静安", "普陀", "闸北", "虹口", "杨浦", "闵行", "宝山区", "嘉定", "浦东新", "金山", "松江", "青浦", "南汇", "奉贤", "崇明县", "城桥镇"],
    "3": ["渝中", "大渡口", "江北", "沙坪坝", "九龙坡", "南岸", "北碚", "万盛", "双桥", "渝北", "巴南", "万州", "涪陵", "黔江", "长寿", "合川", "永川", "江津", "南川", "綦江县", "潼南县", "铜梁县", "大足县", "荣昌县", "璧山县", "垫江县", "武隆县", "丰都县", "城口县", "梁平县", "开县", "巫溪县", "巫山县", "奉节县", "云阳县", "忠县", "石柱土家族自治县", "彭水苗族土家族自治县", "酉阳土家族苗族自治县", "秀山土家族苗族自治县", '两江新区'],
    "4": ["石家庄", "张家口", "承德", "秦皇岛", "唐山", "廊坊", "保定", "衡水", "沧州", "邢台", "邯郸"],
    "5": ["太原", "朔州", "大同", "阳泉", "长治", "晋城", "忻州", "晋中", "临汾", "吕梁", "运城"],
    "6": ["呼和浩特", "包头", "乌海", "赤峰", "通辽", "呼伦贝尔", "鄂尔多斯", "乌兰察布", "巴彦淖尔", "兴安盟", "锡林郭勒盟", "阿拉善盟"],
    "7": ["沈阳", "朝阳", "阜新", "铁岭", "抚顺", "本溪", "辽阳", "鞍山", "丹东", "大连", "营口", "盘锦", "锦州", "葫芦岛"],
    "8": ["长春", "白城", "松原", "吉林", "四平", "辽源", "通化", "白山", "延边州"],
    "9": ["哈尔滨", "齐齐哈尔", "七台河", "黑河", "大庆", "鹤岗", "伊春", "佳木斯", "双鸭山", "鸡西", "牡丹江", "绥化", "大兴安岭"],
    "10": ["南京", "徐州", "连云港", "宿迁", "淮安", "盐城", "扬州", "泰州", "南通", "镇江", "常州", "无锡", "苏州"],
    "11": ["杭州", "湖州", "嘉兴", "舟山", "宁波", "绍兴", "衢州", "金华", "台州", "温州", "丽水"],
    "12": ["合肥", "宿州", "淮北", "亳州", "阜阳", "蚌埠", "淮南", "滁州", "马鞍山", "芜湖", "铜陵", "安庆", "黄山", "六安", "巢湖", "池州", "宣城"],
    "13": ["福州", "南平", "莆田", "三明", "泉州", "厦门", "漳州", "龙岩", "宁德"],
    "14": ["南昌", "九江", "景德镇", "鹰潭", "新余", "萍乡", "赣州", "上饶", "抚州", "宜春", "吉安"],
    "15": ["济南", "青岛", "聊城", "德州", "东营", "淄博", "潍坊", "烟台", "威海", "日照", "临沂", "枣庄", "济宁", "泰安", "莱芜", "滨州", "菏泽"],
    "16": ["郑州", "开封", "三门峡", "洛阳", "焦作", "新乡", "鹤壁", "安阳", "濮阳", "商丘", "许昌", "漯河", "平顶山", "南阳", "信阳", "周口", "驻马店", "济源"],

    "17": ['鄂州', '恩施', '黄冈', '黄石', '荆门', '荆州', '潜江', '神农架', '十懼', '随州', '天门', '武汉', '仙桃', '咸宁', '襄阳', '孝感', '宜昌'],

    "18": ["长沙", "张家界", "常德", "益阳", "岳阳", "株洲", "湘潭", "衡阳", "郴州", "永州", "邵阳", "怀化", "娄底", "湘西州"],
    "19": ["广州", "深圳", "清远", "韶关", "河源", "梅州", "潮州", "汕头", "揭阳", "汕尾", "惠州", "东莞", "珠海", "中山", "江门", "佛山", "肇庆", "云浮", "阳江", "茂名", "湛江"],
    "20": ["南宁", "桂林", "柳州", "梧州", "贵港", "玉林", "钦州", "北海", "防城港", "崇左", "百色", "河池", "来宾", "贺州"],
    "21": ['白沙', '保亭', '昌江', '澄迈', '儋州', '定安', '东方', '海口', '乐东', '临高', '陵水', '琼海', '琼中', '三沙', '三亚', '屯昌', '万宁', '文昌', '五指山'],


    "22": ["成都", "广元", "绵阳", "德阳", "南充", "广安", "遂宁", "内江", "乐山", "自贡", "泸州", "宜宾", "攀枝花", "巴中", "达州", "资阳", "眉山", "雅安", "阿坝州", "甘孜州", "凉山州"],
    "23": ["贵阳", "六盘水", "遵义", "安顺", "毕节", "铜仁", "黔东南州", "黔南州", "黔西南州"],
    "24": ["昆明", "曲靖", "玉溪", "保山", "昭通", "丽江", "思茅", "临沧", "德宏州", "怒江州", "迪庆州", "大理州", "楚雄州", "红河州", "文山州", "西双版纳州"],
    "25": ["拉萨", "那曲", "昌都", "林芝", "山南", "日喀则", "阿里"],
    "26": ["西安", "延安", "铜川", "渭南", "咸阳", "宝鸡", "汉中", "榆林", "安康", "商洛"],
    "27": ["兰州", "嘉峪关", "白银", "天水", "武威", "酒泉", "张掖", "庆阳", "平凉", "定西", "陇南", "临夏州", "甘南州"],
    "28": ["西宁", "海东", "海北州", "海南州", "黄南州", "果洛州", "玉树州", "海西州"],
    "29": ["银川", "石嘴山", "吴忠", "固原", "中卫"],
    "30": ['阿克苏', '阿拉尔', '阿勒泰', '巴音郭楞', '博尔塔拉', '昌吉', '哈密', '和田', '喀什', '克拉玛依', '克孜勒苏', '石河子', '塔城', '图木舒克', '吐鲁番', '乌鲁木齐', '五家渠', '伊犁'],


    "31": ["香港特别行政区"],
    "32": ["澳门特别行政区"],
    "33": ["台北", "高雄", "台中", "花莲", "基隆", "嘉义", "金门", "连江", "苗栗", "南投", "澎湖", "屏东", "台东", "台南", "桃园", "新竹", "宜兰", "云林", "彰化"],
  };
  if (isSearch) {
    provinces.splice(0, 0, '全国');
    // 添加每一项 第一项为全部
    for (let o in citys) {
      citys[o].splice(0, 0, '全部');
    }
    citys = {
      ...citys,
      ...{
        "-1": ["全部"]
      }
    };
  }
  return {
    provinces,
    citys
  };
};
export default city;