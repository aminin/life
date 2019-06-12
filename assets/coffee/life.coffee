do ->
  if window.jQuery
    return
  script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = 'https://yastatic.net/jquery/2.2.3/jquery.min.js'
  document.body.appendChild script
  return

class LifeMatrix
  constructor: (width, height, isCyclic) ->
    @width = width
    @height = height
    @isCyclic = isCyclic
    @matrix = []
    @fill undefined
    return

  fill: (value, arrayToFill) ->
    arr = arrayToFill or @matrix
    i = 0
    while i < @width
      typeof arr[i] != 'Array' and (arr[i] = [])
      j = 0
      while j < @height
        arr[i][j] = if typeof value == 'function' then value(i, j, arr[i][j]) else value
        j++
      i++
    return

  randomize: ->
    @fill ->
      Math.round Math.random()
    return

  neighboursCount: (i, j) ->
    (@get(i - 1, j - 1) or 0) + (@get(i - 1, j) or 0) + (@get(i - 1, j + 1) or 0) + (@get(i, j - 1) or 0) + 0 + (@get(i, j + 1) or 0) + (@get(i + 1, j - 1) or 0) + (@get(i + 1, j) or 0) + (@get(i + 1, j + 1) or 0)

  get: (i, j) ->
    if @isCyclic
      ii = undefined
      jj = undefined
      ii = i % @width
      ii = if ii < 0 then ii + @width else ii
      jj = j % @height
      jj = if jj < 0 then jj + @height else jj
      @matrix[ii][jj]
    else
      if j < 0 or j >= @height or i < 0 or i >= @width then undefined else @matrix[i][j]

  update: ->
    w = []
    @fill ((i, j) =>
      a = @neighboursCount(i, j)
      if a == 3
        return 1
      if a > 3 or a < 2
        return 0
      @matrix[i][j]
    ), w
    @matrix = w
    return

class LifeDisplay

  constructor: ($, dotSize) ->
    @$ = $
    @$window = $(window)
    @dotSize = dotSize or 10
    @$field = $('<div id="life-field"></div>')
    @$dot = $('<div class="dot"></div>')
    @fieldCss =
      'position': 'fixed'
      'background': 'lightblue'
      'opacity': 0.7
      'z-index': '1000'
    @dotCss =
      'position': 'absolute'
      'background': 'orangered'
      'border-radius': @dotSize / 2 + 'px'
      'width': @dotSize + 'px'
      'height': @dotSize + 'px'
    @sizeX = Math.floor(@$window.width() / @dotSize)
    @sizeY = Math.floor(@$window.height() / @dotSize)
    @sizeXpx = @sizeX * @dotSize
    @sizeYpx = @sizeY * @dotSize
    @dotMatrix = []
    @injectCss()
    @injectField()
    @injectDots()
    return

  injectCss: ->
    @$field.css @fieldCss
    @$dot.css @dotCss
    @$('head').append $('<style type="text/css">' + '#life-field { ' + @$field.attr('style') + '}' + '#life-field .dot { ' + @$dot.attr('style') + '}' + '</style>')
    @$field.removeAttr 'style'
    @$dot.removeAttr 'style'
    return

  injectField: ->
    @$field.css
      'width': @sizeXpx + 'px'
      'height': @sizeYpx + 'px'
      'top': Math.floor((@$window.height() - (@sizeYpx)) / 2) + 'px'
      'left': Math.floor((@$window.width() - (@sizeXpx)) / 2) + 'px'
    @$('body').append @$field
    return

  injectDots: ->
    $theDot = undefined
    i = 0
    while i < @sizeX
      @dotMatrix[i] = []
      j = 0
      while j < @sizeY
        $theDot = @$dot.clone()
        @$field.append $theDot
        $theDot.css
          'top': j * @dotSize
          'left': i * @dotSize
        @dotMatrix[i][j] = $theDot
        j++
      i++
    return

  display: (matrix) ->
    _this = this
    matrix.forEach (cols, i) ->
      cols.forEach (a, j) ->
        doWhat = if a then 'show' else 'hide'
        _this.dotMatrix[i][j][doWhat]()
        return
      return
    return

((method) ->

  defer = (method) ->
    if window.jQuery
      method window.jQuery
    else
      setTimeout (->
        defer method
        return
      ), 50
    return

  defer method
  return
) ($) ->
  interval = 1000
  ld = new LifeDisplay($, 20)
  lm = new LifeMatrix(ld.sizeX, ld.sizeY, true)
  lm.randomize()
  ld.display lm.matrix
  window.lifeInterval = setInterval((->
    lm.update()
    ld.display lm.matrix
    return
  ), interval)
  $('body').click ->
    clearInterval window.lifeInterval
    return
  return
