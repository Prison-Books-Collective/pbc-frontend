import { c as create_ssr_component, e as escape } from "../../../../chunks/index-491ed483.js";
var INMATE_SEARCH_MODE;
(function(INMATE_SEARCH_MODE2) {
  INMATE_SEARCH_MODE2["CREATE"] = "create";
  INMATE_SEARCH_MODE2["DISAMBIGUATION"] = "disambiguation";
})(INMATE_SEARCH_MODE || (INMATE_SEARCH_MODE = {}));
function load({ params }) {
  const { mode, firstName, lastName } = params;
  return { props: { mode, firstName, lastName } };
}
const U5BfirstNameu5D_u5BlastNameu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { mode } = $$props;
  let { firstName, lastName } = $$props;
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0)
    $$bindings.mode(mode);
  if ($$props.firstName === void 0 && $$bindings.firstName && firstName !== void 0)
    $$bindings.firstName(firstName);
  if ($$props.lastName === void 0 && $$bindings.lastName && lastName !== void 0)
    $$bindings.lastName(lastName);
  return `<p>${escape(JSON.stringify({ mode, firstName, lastName }))}</p>`;
});
export { INMATE_SEARCH_MODE, U5BfirstNameu5D_u5BlastNameu5D as default, load };
