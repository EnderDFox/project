//个人类
class ProfilePanelClass {
	//入口协议
	Index() {
		WSConn.sendMsg(C2L.C2L_PROFILE_VIEW, {})
	}
	//绑定事件
	BindActions() {
		//指定图表的配置项和数据
		echarts.init(document.getElementById('mainA')).setOption({
			title: {
				text: '肌肉大比拼',
				//left: 'center',
				textStyle: {
					align: 'center',
				}
			},
			tooltip: {},
			legend: {
				data: ['肌肉']
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			xAxis: {
				data: ["炯爷", "老羊", "老歪", "麦子", "暴力熊", "村长"]
			},
			yAxis: {},
			series: [{
				name: '肌肉',
				type: 'bar',
				data: [50, 20, 36, 10, 80, 20]
			}]
		});
		//绘制图表。
		echarts.init(document.getElementById('mainB')).setOption({
			title: { text: '饼图' },
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			series: {
				type: 'pie',
				data: [
					{ name: '大饼', value: 40 },
					{ name: '油条', value: 80 },
					{ name: '包子', value: 20 }
				]
			}
		});
		//基于准备好的dom，初始化 echarts 实例并绘制图表。
		echarts.init(document.getElementById('mainC')).setOption({
			title: { text: '曲线图' },
			tooltip: {},
			toolbox: {
				feature: {
					dataView: {},
					saveAsImage: {
						pixelRatio: 2
					},
					restore: {}
				}
			},
			xAxis: {},
			yAxis: {},
			series: [{
				type: 'line',
				smooth: true,
				data: [[12, 5], [24, 20], [36, 36], [48, 10], [60, 10], [72, 20]]
			}]
		});

		//折线图堆叠
		echarts.init(document.getElementById('mainD')).setOption({
			title: {
				text: '折线图堆叠'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					name: '邮件营销',
					type: 'line',
					stack: '总量',
					data: [120, 132, 101, 134, 90, 230, 210]
				},
				{
					name: '联盟广告',
					type: 'line',
					stack: '总量',
					data: [220, 182, 191, 234, 290, 330, 310]
				},
				{
					name: '视频广告',
					type: 'line',
					stack: '总量',
					data: [150, 232, 201, 154, 190, 330, 410]
				},
				{
					name: '直接访问',
					type: 'line',
					stack: '总量',
					data: [320, 332, 301, 334, 390, 330, 320]
				},
				{
					name: '搜索引擎',
					type: 'line',
					stack: '总量',
					data: [820, 932, 901, 934, 1290, 1330, 1320]
				}
			]
		});

		//多 Y 轴示例
		var colors = ['#5793f3', '#d14a61', '#675bba'];
		echarts.init(document.getElementById('mainE')).setOption({
			color: ['#5793f3', '#d14a61', '#675bba'],
			title: {
				text: '多 Y 轴示例'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				}
			},
			grid: {
				right: '20%'
			},
			toolbox: {
				feature: {
					dataView: { show: true, readOnly: false },
					restore: { show: true },
					saveAsImage: { show: true }
				}
			},
			legend: {
				data: ['蒸发量', '降水量', '平均温度']
			},
			xAxis: [
				{
					type: 'category',
					axisTick: {
						alignWithLabel: true
					},
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
				}
			],
			yAxis: [
				{
					type: 'value',
					name: '蒸发量',
					min: 0,
					max: 250,
					position: 'right',
					axisLine: {
						lineStyle: {
							color: colors[0]
						}
					},
					axisLabel: {
						formatter: '{value} ml'
					}
				},
				{
					type: 'value',
					name: '降水量',
					min: 0,
					max: 250,
					position: 'right',
					offset: 80,
					axisLine: {
						lineStyle: {
							color: colors[1]
						}
					},
					axisLabel: {
						formatter: '{value} ml'
					}
				},
				{
					type: 'value',
					name: '温度',
					min: 0,
					max: 25,
					position: 'left',
					axisLine: {
						lineStyle: {
							color: colors[2]
						}
					},
					axisLabel: {
						formatter: '{value} °C'
					}
				}
			],
			series: [
				{
					name: '蒸发量',
					type: 'bar',
					data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
				},
				{
					name: '降水量',
					type: 'bar',
					yAxisIndex: 1,
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
				},
				{
					name: '平均温度',
					type: 'line',
					yAxisIndex: 2,
					data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
				}
			]
		});

		//用量分布
		echarts.init(document.getElementById('mainF')).setOption({
			title: {
				text: '用量分布',
				subtext: '纯属虚构'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				}
			},
			toolbox: {
				show: true,
				feature: {
					saveAsImage: {}
				}
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value} W'
				},
				axisPointer: {
					snap: true
				}
			},
			visualMap: {
				show: false,
				dimension: 0,
				pieces: [{
					lte: 6,
					color: 'green'
				}, {
					gt: 6,
					lte: 8,
					color: 'red'
				}, {
					gt: 8,
					lte: 14,
					color: 'green'
				}, {
					gt: 14,
					lte: 17,
					color: 'red'
				}, {
					gt: 17,
					color: 'green'
				}]
			},
			series: [
				{
					name: '用量',
					type: 'line',
					smooth: true,
					data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
					markArea: {
						data: [[{
							name: '早高峰',
							xAxis: '07:30'
						}, {
							xAxis: '10:00'
						}], [{
							name: '晚高峰',
							xAxis: '17:30'
						}, {
							xAxis: '21:15'
						}]]
					}
				}
			]
		});

		//未来一周气温变化
		echarts.init(document.getElementById('mainG')).setOption({
			title: {
				text: '未来一周气温变化',
				subtext: '纯属虚构'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['最高气温', '最低气温']
			},
			toolbox: {
				show: true,
				feature: {
					dataZoom: {
						yAxisIndex: 'none'
					},
					dataView: { readOnly: false },
					magicType: { type: ['line', 'bar'] },
					restore: {},
					saveAsImage: {}
				}
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value} °C'
				}
			},
			series: [
				{
					name: '最高气温',
					type: 'line',
					data: [11, 11, 15, 13, 12, 13, 10],
					markPoint: {
						data: [
							{ type: 'max', name: '最大值' },
							{ type: 'min', name: '最小值' }
						]
					},
					markLine: {
						data: [
							{ type: 'average', name: '平均值' }
						]
					}
				},
				{
					name: '最低气温',
					type: 'line',
					data: [1, -2, 2, 5, 3, 2, 0],
					markPoint: {
						data: [
							{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }
						]
					},
					markLine: {
						data: [
							{ type: 'average', name: '平均值' },
							[{
								symbol: 'none',
								x: '90%',
								yAxis: 'max'
							}, {
								symbol: 'circle',
								label: {
									normal: {
										position: 'start',
										formatter: '最大值'
									}
								},
								type: 'max',
								name: '最高点'
							}]
						]
					}
				}
			]
		});

		//多 X 轴示例
		var colors = ['#5793f3', '#d14a61', '#675bba'];
		echarts.init(document.getElementById('mainH')).setOption({
			color: colors,
			title: {
				text: '多 X 轴示例',
				subtext: '纯属虚构'
			},
			tooltip: {
				trigger: 'none',
				axisPointer: {
					type: 'cross'
				}
			},
			legend: {
				data: ['2015 降水量', '2016 降水量']
			},
			grid: {
				top: 70,
				bottom: 50
			},
			xAxis: [
				{
					type: 'category',
					axisTick: {
						alignWithLabel: true
					},
					axisLine: {
						onZero: false,
						lineStyle: {
							color: colors[1]
						}
					},
					axisPointer: {
						label: {
							formatter: function (params) {
								return '降水量  ' + params.value
									+ (params.seriesData.length ? '：' + params.seriesData[0].data : '');
							}
						}
					},
					data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
				},
				{
					type: 'category',
					axisTick: {
						alignWithLabel: true
					},
					axisLine: {
						onZero: false,
						lineStyle: {
							color: colors[0]
						}
					},
					axisPointer: {
						label: {
							formatter: function (params) {
								return '降水量  ' + params.value
									+ (params.seriesData.length ? '：' + params.seriesData[0].data : '');
							}
						}
					},
					data: ["2015-1", "2015-2", "2015-3", "2015-4", "2015-5", "2015-6", "2015-7", "2015-8", "2015-9", "2015-10", "2015-11", "2015-12"]
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: [
				{
					name: '2015 降水量',
					type: 'line',
					xAxisIndex: 1,
					smooth: true,
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
				},
				{
					name: '2016 降水量',
					type: 'line',
					smooth: true,
					data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
				}
			]
		});

		//水印 - ECharts 下载统计
		var builderJson = {
			"all": 10887,
			"charts": {
				"map": 3237,
				"lines": 2164,
				"bar": 7561,
				"line": 7778,
				"pie": 7355,
				"scatter": 2405,
				"candlestick": 1842,
				"radar": 2090,
				"heatmap": 1762,
				"treemap": 1593,
				"graph": 2060,
				"boxplot": 1537,
				"parallel": 1908,
				"gauge": 2107,
				"funnel": 1692,
				"sankey": 1568
			},
			"components": {
				"geo": 2788,
				"title": 9575,
				"legend": 9400,
				"tooltip": 9466,
				"grid": 9266,
				"markPoint": 3419,
				"markLine": 2984,
				"timeline": 2739,
				"dataZoom": 2744,
				"visualMap": 2466,
				"toolbox": 3034,
				"polar": 1945
			},
			"ie": 9743
		};

		var downloadJson = {
			"echarts.min.js": 17365,
			"echarts.simple.min.js": 4079,
			"echarts.common.min.js": 6929,
			"echarts.js": 14890
		};

		var themeJson = {
			"dark.js": 1594,
			"infographic.js": 925,
			"shine.js": 1608,
			"roma.js": 721,
			"macarons.js": 2179,
			"vintage.js": 1982
		};

		var waterMarkText = 'ECHARTS';

		var canvas:HTMLCanvasElement = document.createElement('canvas');
		var ctx:CanvasRenderingContext2D = canvas.getContext('2d');
		canvas.width = canvas.height = 100;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.globalAlpha = 0.08;
		ctx.font = '20px Microsoft Yahei';
		ctx.translate(50, 50);
		ctx.rotate(-Math.PI / 4);
		ctx.fillText(waterMarkText, 0, 0);

		echarts.init(document.getElementById('mainI')).setOption({
			backgroundColor: {
				type: 'pattern',
				image: canvas,
				repeat: 'repeat'
			},
			tooltip: {},
			title: [{
				text: '在线构建',
				subtext: '总计 ' + builderJson.all,
				x: '25%',
				textAlign: 'center'
			}, {
				text: '各版本下载',
				subtext: '总计 ' + Object.keys(downloadJson).reduce(function (all, key) {
					return all + downloadJson[key];
				}, 0),
				x: '75%',
				textAlign: 'center'
			}, {
				text: '主题下载',
				subtext: '总计 ' + Object.keys(themeJson).reduce(function (all, key) {
					return all + themeJson[key];
				}, 0),
				x: '75%',
				y: '50%',
				textAlign: 'center'
			}],
			grid: [{
				top: 50,
				width: '50%',
				bottom: '45%',
				left: 10,
				containLabel: true
			}, {
				top: '55%',
				width: '50%',
				bottom: 0,
				left: 10,
				containLabel: true
			}],
			xAxis: [{
				type: 'value',
				max: builderJson.all,
				splitLine: {
					show: false
				}
			}, {
				type: 'value',
				max: builderJson.all,
				gridIndex: 1,
				splitLine: {
					show: false
				}
			}],
			yAxis: [{
				type: 'category',
				data: Object.keys(builderJson.charts),
				axisLabel: {
					interval: 0,
					rotate: 30
				},
				splitLine: {
					show: false
				}
			}, {
				gridIndex: 1,
				type: 'category',
				data: Object.keys(builderJson.components),
				axisLabel: {
					interval: 0,
					rotate: 30
				},
				splitLine: {
					show: false
				}
			}],
			series: [{
				type: 'bar',
				stack: 'chart',
				z: 3,
				label: {
					normal: {
						position: 'right',
						show: true
					}
				},
				data: Object.keys(builderJson.charts).map(function (key) {
					return builderJson.charts[key];
				})
			}, {
				type: 'bar',
				stack: 'chart',
				silent: true,
				itemStyle: {
					normal: {
						color: '#eee'
					}
				},
				data: Object.keys(builderJson.charts).map(function (key) {
					return builderJson.all - builderJson.charts[key];
				})
			}, {
				type: 'bar',
				stack: 'component',
				xAxisIndex: 1,
				yAxisIndex: 1,
				z: 3,
				label: {
					normal: {
						position: 'right',
						show: true
					}
				},
				data: Object.keys(builderJson.components).map(function (key) {
					return builderJson.components[key];
				})
			}, {
				type: 'bar',
				stack: 'component',
				silent: true,
				xAxisIndex: 1,
				yAxisIndex: 1,
				itemStyle: {
					normal: {
						color: '#eee'
					}
				},
				data: Object.keys(builderJson.components).map(function (key) {
					return builderJson.all - builderJson.components[key];
				})
			}, {
				type: 'pie',
				radius: [0, '30%'],
				center: ['75%', '25%'],
				data: Object.keys(downloadJson).map(function (key) {
					return {
						name: key.replace('.js', ''),
						value: downloadJson[key]
					}
				})
			}, {
				type: 'pie',
				radius: [0, '30%'],
				center: ['75%', '75%'],
				data: Object.keys(themeJson).map(function (key) {
					return {
						name: key.replace('.js', ''),
						value: themeJson[key]
					}
				})
			}]
		})
	}
	//建立内容
	CreateProfile() {
		/*
		//组合thead
		var html = '<div id="freezeTop" class="profileLock"><div class="lockTop"><table class="profile" id="rowLock">'
		html+= ProfilePanel.GetTheadHtml()
		html+= '</table></div></div>'
		html+= '<div class="profileLockBody"><table class="profile">'
		//组合tbody
		html+= ProfilePanel.GetTbodyHtml()
		html+= '</table></div>'
		Main.Draw(html)
		$('#freezeTop').unbind().freezeTop()
		*/
		//组合thead
		var html = '<div id="freezeTop" class="profileLock"><div class="lockTop"><table class="profile" id="rowLock">'
		html += ProfilePanel.GetTheadHtml()
		//组合tbody
		html += ProfilePanel.GetTbodyHtml()
		html += '</table></div></div>'
		html += this.DrawCanvas()
		Main.Draw(html)
		//$('#freezeTop').unbind().freezeTop()
	}
	//组合thead
	GetTheadHtml() {
		var html = '<tr>'
		var toDay = Common.FmtDate(new Date())
		$.each(ProfileData.DateList, function (k, d: string) {
			if (toDay == d) {
				html += '<td class="today">' + d + '</td>'
			} else {
				html += '<td class="title">' + d + '</td>'
			}
		})
		html += '</tr>'
		return html
	}
	//组合tbody
	GetTbodyHtml() {
		var html = '<tr>'
		$.each(ProfileData.DateList, function (k, d: string) {
			html += '<td><ol>'
			$.each(ProfileData.DataMap[d], function (k, v: ProfileSingle) {
				html += '<li>'
				html += '<span class="check_' + v.Inspect + '">' + v.Ver + v.MName + '-' + v.LName + '</span>'
				html += '<span class="special">'
				if (v.MinNum > 0 || v.MaxNum > 0) {
					html += '（' + v.MinNum + '/' + v.MaxNum + '）'
				}
				if (v.Tips != '') {
					html += '（' + v.Tips + '）'
				}
				if (v.Tag != '') {
					var TagInfo = ProfileData.TagsMap[v.Tag]
					if (TagInfo) {
						html += '（' + TagInfo.Info + '）'
					} else {
						html += '（' + v.Tag + '）'
					}
				} else {
					html += '（' + CollateData.StatusList[v.Status].Info + '）'
				}
				html += '</span>'
				html += '</li>'
			})
			html += '</td></ol>'
		})
		html += '</tr>'
		return html
	}
	//画图测试
	DrawCanvas() {
		var html: string = '<div style="width:auto;border:0px solid red;display:inline-block;">'
		html += '<div id="mainA" style="border:1px solid #6c6c6c;width:750px;height:400px;box-shadow:0px 0px 3px #333333;margin:10px 0px 0px 10px;float:left;"></div>'
		html += '<div id="mainB" style="border:1px solid #6c6c6c;width:750px;height:400px;box-shadow:0px 0px 3px #333333;margin:10px 0px 0px 10px;float:left;"></div>'
		html += '<div id="mainC" style="border:1px solid #6c6c6c;width:750px;height:400px;box-shadow:0px 0px 3px #333333;margin:10px 0px 0px 10px;float:left;"></div>'
		html += '<div id="mainD" style="border:1px solid #6c6c6c;width:750px;height:400px;box-shadow:0px 0px 3px #333333;margin:10px 0px 0px 10px;float:left;"></div>'
		html += '<div id="mainE" style="border:1px solid #6c6c6c;width:750px;height:400px;box-shadow:0px 0px 3px #333333;margin:10px 0px 0px 10px;float:left;"></div>'
		html += '<div id="mainF" style="border:1px solid #6c6c6c;width:750px;height:400px;box-shadow:0px 0px 3px #333333;margin:10px 0px 0px 10px;float:left;"></div>'
		html += '<div id="mainG" style="border:1px solid #6c6c6c;width:750px;height:400px;box-shadow:0px 0px 3px #333333;margin:10px 0px 0px 10px;float:left;"></div>'
		html += '<div id="mainH" style="border:1px solid #6c6c6c;width:750px;height:400px;box-shadow:0px 0px 3px #333333;margin:10px 0px 0px 10px;float:left;"></div>'
		html += '<div id="mainI" style="border:1px solid #6c6c6c;width:1512px;height:600px;box-shadow:0px 0px 3px #333333;margin:10px 0px 0px 10px;float:left;"></div>'
		html += '</div>'
		return html
	}
}


var ProfilePanel = new ProfilePanelClass()