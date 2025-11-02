"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_api_src_lib_jwt_js";
exports.ids = ["_api_src_lib_jwt_js"];
exports.modules = {

/***/ "(api)/./src/lib/jwt.js":
/*!************************!*\
  !*** ./src/lib/jwt.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   signToken: () => (/* binding */ signToken),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n\nconst JWT_SECRET = process.env.JWT_SECRET || \"dev_secret_change_me\";\nconst EXPIRES_IN = \"7d\";\nfunction signToken(payload) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().sign(payload, JWT_SECRET, {\n        expiresIn: EXPIRES_IN\n    });\n}\nfunction verifyToken(token) {\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().verify(token, JWT_SECRET);\n    } catch (e) {\n        return null;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvbGliL2p3dC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQThCO0FBRTlCLE1BQU1DLGFBQWFDLFFBQVFDLEdBQUcsQ0FBQ0YsVUFBVSxJQUFJO0FBQzdDLE1BQU1HLGFBQWE7QUFFWixTQUFTQyxVQUFVQyxPQUFPO0lBQy9CLE9BQU9OLHdEQUFRLENBQUNNLFNBQVNMLFlBQVk7UUFBRU8sV0FBV0o7SUFBVztBQUMvRDtBQUVPLFNBQVNLLFlBQVlDLEtBQUs7SUFDL0IsSUFBSTtRQUNGLE9BQU9WLDBEQUFVLENBQUNVLE9BQU9UO0lBQzNCLEVBQUUsT0FBT1csR0FBRztRQUNWLE9BQU87SUFDVDtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmlud2lzZWJvdC13ZWJzaXRlLy4vc3JjL2xpYi9qd3QuanM/ZTEwNCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgand0IGZyb20gJ2pzb253ZWJ0b2tlbidcclxuXHJcbmNvbnN0IEpXVF9TRUNSRVQgPSBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIHx8ICdkZXZfc2VjcmV0X2NoYW5nZV9tZSdcclxuY29uc3QgRVhQSVJFU19JTiA9ICc3ZCdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaWduVG9rZW4ocGF5bG9hZCkge1xyXG4gIHJldHVybiBqd3Quc2lnbihwYXlsb2FkLCBKV1RfU0VDUkVULCB7IGV4cGlyZXNJbjogRVhQSVJFU19JTiB9KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5VG9rZW4odG9rZW4pIHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGp3dC52ZXJpZnkodG9rZW4sIEpXVF9TRUNSRVQpXHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbImp3dCIsIkpXVF9TRUNSRVQiLCJwcm9jZXNzIiwiZW52IiwiRVhQSVJFU19JTiIsInNpZ25Ub2tlbiIsInBheWxvYWQiLCJzaWduIiwiZXhwaXJlc0luIiwidmVyaWZ5VG9rZW4iLCJ0b2tlbiIsInZlcmlmeSIsImUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/lib/jwt.js\n");

/***/ })

};
;