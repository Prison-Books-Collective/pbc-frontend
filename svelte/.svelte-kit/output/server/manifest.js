export const manifest = {
	appDir: "_app",
	assets: new Set(["favicon.png","fonts/gentium/GentiumBasic-Bold.ttf","fonts/gentium/GentiumBasic-BoldItalic.ttf","fonts/gentium/GentiumBasic-Italic.ttf","fonts/gentium/GentiumBasic-Regular.ttf","fonts/gentium/OFL.txt","fonts/roboto/Roboto-Black.ttf","fonts/roboto/Roboto-BlackItalic.ttf","fonts/roboto/Roboto-Bold.ttf","fonts/roboto/Roboto-BoldCondensed.ttf","fonts/roboto/Roboto-BoldCondensedItalic.ttf","fonts/roboto/Roboto-BoldItalic.ttf","fonts/roboto/Roboto-Condensed.ttf","fonts/roboto/Roboto-CondensedItalic.ttf","fonts/roboto/Roboto-Italic.ttf","fonts/roboto/Roboto-Light.ttf","fonts/roboto/Roboto-LightItalic.ttf","fonts/roboto/Roboto-Medium.ttf","fonts/roboto/Roboto-MediumItalic.ttf","fonts/roboto/Roboto-Regular.ttf","fonts/roboto/Roboto-Thin.ttf","fonts/roboto/Roboto-ThinItalic.ttf","pbc-logo.png","pbc-logo.svg","styles.scss"]),
	_: {
		mime: {".png":"image/png",".ttf":"font/ttf",".txt":"text/plain",".svg":"image/svg+xml",".scss":"text/x-scss"},
		entry: {"file":"start-2838df04.js","js":["start-2838df04.js","chunks/vendor-966ec74d.js","chunks/singletons-d1fb5791.js"],"css":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js'),
			() => import('./nodes/4.js'),
			() => import('./nodes/5.js'),
			() => import('./nodes/6.js')
		],
		routes: [
			{
				type: 'page',
				key: "",
				pattern: /^\/$/,
				params: null,
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				key: "overview/[inmateId]",
				pattern: /^\/overview\/([^/]+?)\/?$/,
				params: (m) => ({ inmateId: m[1]}),
				path: null,
				shadow: null,
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				key: "inmate/[mode]/[firstName]-[lastName]",
				pattern: /^\/inmate\/([^/]+?)\/([^/]+?)-([^/]+?)\/?$/,
				params: (m) => ({ mode: m[1], firstName: m[2], lastName: m[3]}),
				path: null,
				shadow: null,
				a: [0,4],
				b: [1]
			},
			{
				type: 'page',
				key: "admin",
				pattern: /^\/admin\/?$/,
				params: null,
				path: "/admin",
				shadow: null,
				a: [0,5],
				b: [1]
			},
			{
				type: 'page',
				key: "home",
				pattern: /^\/home\/?$/,
				params: null,
				path: "/home",
				shadow: null,
				a: [0,6],
				b: [1]
			}
		]
	}
};
