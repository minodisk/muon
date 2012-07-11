###
GitHub : https://github.com/minodisk/muon
Author : Daisuke Mino
License: MIT License
###
window = @
if typeof window.muon is 'undefined' then window.muon = {}
if typeof window.muon.dom is 'undefined' then window.muon.dom = {}
if typeof window.muon.css3 is 'undefined' then window.muon.css3 = {}
if typeof window.muon.events is 'undefined' then window.muon.events = {}
if typeof window.muon.filters is 'undefined' then window.muon.filters = {}
if typeof window.muon.geom is 'undefined' then window.muon.geom = {}
if typeof window.muon.net is 'undefined' then window.muon.net = {}
if typeof window.muon.serializer is 'undefined' then window.muon.serializer = {}
if typeof window.muon.utils is 'undefined' then window.muon.utils = {}
exports = window.muon