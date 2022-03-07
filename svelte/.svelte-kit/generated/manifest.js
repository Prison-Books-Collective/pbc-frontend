const c = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/overview/[inmateId].svelte"),
	() => import("../../src/routes/inmate/[mode]/[firstName]-[lastName].svelte"),
	() => import("../../src/routes/admin.svelte"),
	() => import("../../src/routes/home.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/overview/[inmateId].svelte
	[/^\/overview\/([^/]+?)\/?$/, [c[0], c[3]], [c[1]], (m) => ({ inmateId: d(m[1])})],

	// src/routes/inmate/[mode]/[firstName]-[lastName].svelte
	[/^\/inmate\/([^/]+?)\/([^/]+?)-([^/]+?)\/?$/, [c[0], c[4]], [c[1]], (m) => ({ mode: d(m[1]), firstName: d(m[2]), lastName: d(m[3])})],

	// src/routes/admin.svelte
	[/^\/admin\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/home.svelte
	[/^\/home\/?$/, [c[0], c[6]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];