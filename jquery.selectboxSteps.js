// Dealer locator multiple selectboxes
(function($) {
  $.selectboxSteps = function(element, options) {
    
    var defaults = {
      selectText: 'Please Select',
      changeCallback: function() {}
    }
    
    var base = this;
    
    var $el = $(element),
     el = element;     

    base.init = function() {
      base.options = $.extend({}, defaults, options);
      
      // get json data, parse 
      $.getJSON(base.options.url, function(data) {
        setOptions($el, data.categories);
//        $el.find('option:first').attr('selected', 'selected');
      });
      
      $el.change(function() {
        base.next($(this));
        base.options.changeCallback($(this));
      });

    }
    
    base.next = function($select) {
      var selected = $select.find('option:selected'),
          $selected = selected.data('category');
          
      if ( typeof $selected !== 'object' ) {
        return false;
      }
            
      if ( typeof $selected === 'object' ) {
        var cancel = $('<a href="#"/>')
          .addClass('step-cancel step-element')
          .click(function(e) {
            e.preventDefault();
            base.prev($(this));
            base.options.changeCallback($(this))
          })
          .data('category', $select.data('category'))
          .append(
            $('<span/>')
              .html($selected.name));

        cancel.hide().insertBefore($select).slideDown('fast');
        //$select.hide();
        
        // if category has sub categories, append new selectbox
        if ( !!$selected.subcategory && !!$selected.subcategory.length ) {
          $select
            .unbind('change')
            .change(function(){
              base.next($(this));
              base.options.changeCallback($(this));
            });

          setOptions($select, $selected.subcategory)

          //$select.insertAfter($select);
        } else {
          $select.hide();
        }
        
      }
      
    }
    
    
    // set options from json
    var setOptions = function($el, data) {
      // set category data to select
      $el.data('category', data);
      
      $el
        .find('option')
        .remove()
        .end()
        .append('<option>' + base.options.selectText + '</option>');
      
      $.each(data, function(i) {
        // set each subcategory data to each option
        $el.append(
          $('<option/>')
            .attr('value', this.id)
            .html(this.name)
            .data('category', this));

      });      
      
      return $el;
    }
    
    base.prev = function($link) {
      var data = $link.data('category');
      $.each(data, function(i){
        setOptions($el, data);
      });
      
      $el.show()
        .attr('selectedIndex', 0);
      
      $link.nextAll('.step-cancel').each(function() {
        $(this).remove();
      });
        
      $link.slideUp('fast', function() {
        $(this).remove();
      })
    }
    
    base.init();

  }

    
  
  $.fn.selectboxSteps = function(options) {
    // if url is not set, return false
    if ( options.url === undefined) {
     return false;
    }
      
    return this.each(function() {
      
      if (undefined == $(this).data('selectboxSteps')) {
        var plugin = new $.selectboxSteps(this, options);
        $(this).data('selectboxSteps', plugin);
      }
    });
  }
    
})(jQuery)