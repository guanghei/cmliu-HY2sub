
// 部署完成后在网址后面加上这个，获取订阅器默认节点，/auto

let mytoken= ['auto'];//快速订阅访问入口, 留空则不启动快速订阅

let subconverter = "url.v1.mk"; //在线订阅转换后端，目前使用肥羊的订阅转换功能。支持自建psub 可自行搭建https://github.com/bulianglin/psub
let subconfig = "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini"; //订阅转换配置文件

let FileName = 'HY2sub';
let SUBUpdateTime = 6; //自定义订阅更新时间，单位小时
let total = 99;//PB
let timestamp = 4102329600000;//2099-12-31

let WARP2sub = 'WARP.fxxk.dedyn.io';
let WARP2subToken = 'auto';

export default {
	async fetch(request, env, ctx) {
		if (env.TOKEN) mytoken = await ADD(env.TOKEN);
		subconverter = env.SUBAPI || subconverter;
		subconfig = env.SUBCONFIG || subconfig;
		WARP2sub = env.WARP2SUB || WARP2sub;
		WARP2subToken = env.WARP2SUBTOKEN || WARP2subToken;
		FileName = env.SUBNAME || FileName;
		SUBUpdateTime = env.SUBUPTIME || SUBUpdateTime;
		let UD = Math.floor(((timestamp - Date.now())/timestamp * 99 * 1099511627776 * 1024)/2);
		total = total * 1099511627776 * 1024;
		let expire= Math.floor(timestamp / 1000) ;
		const UA = request.headers.get('User-Agent') || 'null';
		const userAgent = UA.toLowerCase();
		const url = new URL(request.url);

		if (mytoken.length == 0 || mytoken.some(token => url.pathname.includes(token))) {

		} else {
			const envKey = env.URL302 ? 'URL302' : (env.URL ? 'URL' : null);
			if (envKey) {
				const URLs = await ADD(env[envKey]);
				const URL = URLs[Math.floor(Math.random() * URLs.length)];
				return envKey === 'URL302' ? Response.redirect(URL, 302) : fetch(new Request(URL, request));
			}
			//首页改成一个nginx伪装页
			return new Response(await nginx(), {
				headers: {
					'Content-Type': 'text/html; charset=UTF-8',
				},
			});
		}

		let link = '';
		if(env.LINK){
			const links = await ADD(env.LINK);
			let linkUrl = "";
			for (let x of links) {
				if (x.toLowerCase().startsWith('http')) {
					linkUrl += x + '\n';
				} else {
					link += x + '\n';
				}
			}
			// 创建一个AbortController对象，用于控制fetch请求的取消
			const controller = new AbortController();
			const urls = await ADD(linkUrl);
			const timeout = setTimeout(() => {
				controller.abort(); // 取消所有请求
			}, 2000); // 2秒后触发

			try {
				const responses = await Promise.allSettled(urls.map(url =>
					fetch(url, {
						method: 'get',
						headers: {
							'Accept': 'text/html,application/xhtml+xml,application/xml;',
							'User-Agent': `${UA}`
						},
						signal: controller.signal // 将AbortController的信号量添加到fetch请求中，以便于需要时可以取消请求
					}).then(response => {
						if (response.ok) {
							return response.text().then(content => {
								// 这里可以顺便做内容检查
								if (!content.includes('://')) {
									content = base64Decode(content);
								} else {
									//content = decodeURIComponent(content);
									if (content.includes('\r')){
										content = content.replace(/\r/g, '');
									}
								}
								return content; // 保证链式调用中的下一个then可以接收到文本内容
								//console.log(content);
							});
						} else {
							return ""; // 如果response.ok为false，返回空字符串
						}
					
					})
				));	

				for (const response of responses) {
					if (response.status === 'fulfilled') {
						const content = await response.value;
						link += content + '\n';
					}
				}

			} catch (error) {
				//console.error(error);
			} finally {
				// 无论成功或失败，最后都清除设置的超时定时器
				clearTimeout(timeout);
			}

			console.log(link);
		}

		let siteshy2 = [
			{ url: 'https://raw.githubusercontent.com/Alvin9999/pac2/master/hysteria2/config.json', type: "hysteria2" },
                        { url: 'https://raw.githubusercontent.com/Alvin9999/pac2/master/hysteria2/1/config.json',type: "hysteria2" },
                        { url: 'https://raw.githubusercontent.com/Alvin9999/pac2/master/hysteria2/2/config.json',type: "hysteria2"},
                        { url: 'https://raw.githubusercontent.com/Alvin9999/pac2/master/hysteria2/13/config.json',type: "hysteria2"},
                        { url: 'https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria2/config.json',type: "hysteria2"},
                        { url: 'https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria2/2/config.json',type: "hysteria2"},
                        { url: 'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria2/2/config.json', type: "hysteria2" },
                        { url: 'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria2/config.json', type: "hysteria2" },
		];

		let siteshy = [
			{ url: "https://raw.githubusercontent.com/Alvin9999/pac2/master/hysteria/config.json", type: "hysteria" },
			{ url: "https://raw.githubusercontent.com/Alvin9999/pac2/master/hysteria/1/config.json", type: "hysteria" },
			{ url: "https://raw.githubusercontent.com/Alvin9999/pac2/master/hysteria/2/config.json", type: "hysteria" },
			{ url: "https://raw.githubusercontent.com/Alvin9999/pac2/master/hysteria/13/config.json", type: "hysteria" },
			{ url: "https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria/config.json", type: "hysteria" },
			{ url: "https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria/2/config.json", type: "hysteria" },
			{ url: "https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria/config.json", type: "hysteria" },
			{ url: "https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria/2/config.json", type: "hysteria" },
		];

		let sitessb = [
			{ url: "https://raw.githubusercontent.com/Alvin9999/pac2/master/singbox/config.json", type: "hysteria" },
			{ url: "https://raw.githubusercontent.com/Alvin9999/pac2/master/singbox/1/config.json", type: "hysteria" },
			{ url: "https://gitlab.com/free9999/ipupdate/-/raw/master/singbox/config.json",type: "hysteria"},
			{ url: "https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/singbox/config.json", type: "singbox" },
		];

		// 使用 Promise.all() 并发请求所有站点
		const [hysteria2Responses, hysteriaResponses, singboxResponses] = await Promise.all([
			Promise.all(siteshy2.map(async site => {
				try {
					const response = await fetch(site.url);
					if (response.ok) {
						const data = await response.json();
						return await processHysteria2(data);
					} else {
						console.error(`Failed to fetch data from ${site.url}, status: ${response.status}`);
					}
				} catch (error) {
					console.error(`Error fetching data from ${site.url}:`, error);
				}
				return null;
			})),
			Promise.all(siteshy.map(async site => {
				try {
					const response = await fetch(site.url);
					if (response.ok) {
						const data = await response.json();
						return await processHysteri(data);
					} else {
						console.error(`Failed to fetch data from ${site.url}, status: ${response.status}`);
					}
				} catch (error) {
					console.error(`Error fetching data from ${site.url}:`, error);
				}
				return null;
			})),
			Promise.all(sitessb.map(async site => {
				try {
					const response = await fetch(site.url);
					if (response.ok) {
						const data = await response.json();
						return await processSingbox(data);
					} else {
						console.error(`Failed to fetch data from ${site.url}, status: ${response.status}`);
					}
				} catch (error) {
					console.error(`Error fetching data from ${site.url}:`, error);
				}
				return null;
			}))
		]);

		// 合并所有响应结果
		let responses = [].concat(hysteria2Responses, hysteriaResponses, singboxResponses);
		if (env.LINK && link != ''){
			responses = [].concat(hysteria2Responses, hysteriaResponses, singboxResponses , link.split('\n'));
		}
		
		// 去重
		const 所有节点信息 = [...new Set(responses)];//removeDuplicates(responses);
		let 订阅转换URL = 所有节点信息.join('|')
		//console.log(订阅转换URL);
		let 订阅格式 = 'base64'
		if (userAgent.includes('clash') || url.searchParams.has('clash')){
			订阅格式 = 'clash'
		} else if (userAgent.includes('singbox') || userAgent.includes('sing-box') || url.searchParams.has('sb') || url.searchParams.has('singbox')){
			订阅格式 = 'singbox'
		} else {
			// 将去重后的数据合并成一个字符串
			const combinedString = 所有节点信息.join('\n');
			// 对合并后的字符串进行 Base64 编码
			const base64EncodedString = btoa(unescape(encodeURIComponent(combinedString)));

			return new Response(base64EncodedString, {
				headers: { 
					"content-type": "text/plain; charset=utf-8",
					"Profile-Update-Interval": `${SUBUpdateTime}`,
					"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
				},
			});
		}

		//console.log(订阅转换URL);
		订阅转换URL = `https://${subconverter}/sub?target=${订阅格式}&url=${encodeURIComponent(订阅转换URL)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;

		if (订阅格式 != 'base64'){
			try {
				const subconverterResponse = await fetch(订阅转换URL);
				
				if (!subconverterResponse.ok) {
					return new Response(所有节点信息.join('\n'), {
						headers: { 'content-type': 'text/plain; charset=utf-8' },
					});
					//throw new Error(`Error fetching subconverterUrl: ${subconverterResponse.status} ${subconverterResponse.statusText}`);
				}
				let subconverterContent = await subconverterResponse.text();
				//console.log(subconverterContent);

				if (订阅格式 == 'clash'){
					const WARP2subUrl = await fetch(`https://${WARP2sub}/${WARP2subToken}?warp2clash`, {
						headers: {
							'Content-Type': 'text/html; charset=UTF-8',
							'User-Agent': `${UA} cmliu/HY2sub`
						},
					});
					if (WARP2subUrl.ok) {
						const warpConfigText = await WARP2subUrl.text();
						let warpConfig;
						if (warpConfigText.includes('\r\n\r\ncmliu/WARP2sub\r\n\r\n')){
							warpConfig = warpConfigText.split('\r\n\r\ncmliu/WARP2sub\r\n\r\n');
						} else {
							warpConfig = warpConfigText.split('\n\ncmliu/WARP2sub\n\n');
						}
						//console.log(warpConfig);
						const WARP前置节点ID = warpConfig[0];
						const WARP节点ID = warpConfig[1];
						const WARP节点配置 = warpConfig[2];

						const 找节点列表 = subconverterContent.indexOf("proxies:") + "proxies:".length;
						subconverterContent = subconverterContent.substring(0, 找节点列表) + "\n" + WARP节点配置 + subconverterContent.substring(找节点列表);
						//console.log(subconverterContent);

						subconverterContent = subconverterContent.replace(new RegExp("      - ♻️ 自动选择", 'g'), "      - ♻️ 自动选择\n      - 🌐 WARP+")

						let WARP前置分组 = `  - name: ${WARP前置节点ID}\n    type: select\n    proxies:`;
						if (subconverterContent.indexOf("  - name: 🚀 节点选择")) WARP前置分组 += `\n      - 🚀 节点选择`;
						if (subconverterContent.indexOf("  - name: ♻️ 自动选择")) WARP前置分组 += `\n      - ♻️ 自动选择`;
						if (subconverterContent.indexOf("  - name: 🔯 故障转移")) WARP前置分组 += `\n      - 🔯 故障转移`;
						if (subconverterContent.indexOf("  - name: 🔮 负载均衡")) WARP前置分组 += `\n      - 🔮 负载均衡`;
						//console.log(WARP前置分组);
						WARP前置分组 += `\n  - name: 🌐 WARP+\n    type: url-test\n    url: http://www.gstatic.com/generate_204\n    interval: 300\n    tolerance: 50\n    proxies:\n${WARP节点ID}`
						
						const 找分组列表 = subconverterContent.indexOf("proxy-groups:") + "proxy-groups:".length;
						subconverterContent = subconverterContent.substring(0, 找分组列表) + "\n" + WARP前置分组 + subconverterContent.substring(找分组列表);
						console.log(subconverterContent);

					}
				}
				return new Response(subconverterContent, {
					headers: { 
						"Content-Disposition": `attachment; filename*=utf-8''${encodeURIComponent(FileName)}; filename=${FileName}`,
						"content-type": "text/plain; charset=utf-8",
						"Profile-Update-Interval": `${SUBUpdateTime}`,
						"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
					},
				});
			} catch (error) {
				//console.error('Error fetching content:', error);
				return new Response(所有节点信息.join('\n'), {
					headers: { 'content-type': 'text/plain; charset=utf-8' },
				});
			}
		}
	}
};

async function processHysteria2(data) {
	const auth = data.auth || '';
	const server = data.server || '';
	const insecure = data.tls.insecure ? 1 : 0;
	const sni = data.tls.sni || '';
	const match = server.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
	const ip = match ? match[0] : '8.8.8.8';
	if (ip) {
		const locationInfo = await getLocationInfo(ip);
		const locationInfoEncoded = encodeURIComponent(locationInfo);
		return `hy2://${auth}@${server}?insecure=${insecure}&sni=${sni}#${locationInfoEncoded}`;
	}
	return null;
}

async function processHysteri(data) {
	const up_mps = data.up_mbps;
	const down_mps = data.down_mbps;
	const auth_Str = data.auth_str;
	const server_name = data.server_name;
	const alpn = data.alpn;
	const server = data.server;
	const match = server.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
	const ip = match ? match[0] : '8.8.8.8';
	if (ip) {
		const locationInfo = await getLocationInfo(ip);
		const locationInfoEncoded = encodeURIComponent(locationInfo);
		return `hysteria://${server}?upmbps=${up_mps}&downmbps=${down_mps}&auth=${auth_Str}&insecure=1&peer=${server_name}&alpn=${alpn}#${locationInfoEncoded}`;
	}
	return null;
}

async function processSingbox(data) {
	const outbounds = data.outbounds[0];
	const up_mps = outbounds.up_mbps;
	const down_mps = outbounds.down_mbps;
	const auth_Str = outbounds.auth_str;
	const server_name = outbounds.tls.server_name;
	const alpn = outbounds.tls.alpn[0];
	const server = outbounds.server;
	const port = outbounds.server_port;

	const locationInfo = await getLocationInfo(server);
	const locationInfoEncoded = encodeURIComponent(locationInfo);
	return `hysteria://${server}:${port}?upmbps=${up_mps}&downmbps=${down_mps}&auth=${auth_Str}&insecure=1&peer=${server_name}&alpn=${alpn}#${locationInfoEncoded}`;
	}

async function getLocationInfo(ip) {
	try {
		let response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
		if (response.ok) {
			let data = await response.json();
			//console.log(data);
			if (data.status === "success") {
				return `${data.countryCode} ${data.regionName} ${data.as}`;
			}
		}
	} catch (error) {
		console.error(`Error fetching location data for IP ${ip}:`, error);
	}
	return '';
}

async function nginx() {
	const text = `
	<!DOCTYPE html>
	<html>
	<head>
	<title>Welcome to nginx!</title>
	<style>
		body {
			width: 35em;
			margin: 0 auto;
			font-family: Tahoma, Verdana, Arial, sans-serif;
		}
	</style>
	</head>
	<body>
	<h1>Welcome to nginx!</h1>
	<p>If you see this page, the nginx web server is successfully installed and
	working. Further configuration is required.</p>
	
	<p>For online documentation and support please refer to
	<a href="http://nginx.org/">nginx.org</a>.<br/>
	Commercial support is available at
	<a href="http://nginx.com/">nginx.com</a>.</p>
	
	<p><em>Thank you for using nginx.</em></p>
	</body>
	</html>
	`
	return text ;
}

async function ADD(envadd) {
	var addtext = envadd.replace(/[	|"'\r\n]+/g, ',').replace(/,+/g, ',');	// 将空格、双引号、单引号和换行符替换为逗号
	//console.log(addtext);
	if (addtext.charAt(0) == ',') addtext = addtext.slice(1);
	if (addtext.charAt(addtext.length -1) == ',') addtext = addtext.slice(0, addtext.length - 1);
	const add = addtext.split(',');
	//console.log(add);
	return add ;
}

function base64Decode(str) {
	const bytes = new Uint8Array(atob(str).split('').map(c => c.charCodeAt(0)));
	const decoder = new TextDecoder('utf-8');
	return decoder.decode(bytes);
}
