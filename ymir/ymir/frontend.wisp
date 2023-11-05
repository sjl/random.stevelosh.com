(ns ymir.frontend)

(defn get-form-field [form element]
  (.val ($ (+ "form#" form " [name=" element "]"))))


(defn get-input-string [form element-id]
  (get-form-field form element-id))

(defn get-input-number [form element]
  (parseFloat (get-form-field form element)))

(defn get-input-boolean [form element]
  (if (== "true" (get-form-field form element))
    true
    false))


(defn show-algorithm-settings []
  (console.log "what")
  (let [algorithm (get-input-string "algorithm-selector"
                                    "generation-algorithm")]
    (.hide ($ "#generation-algorithm-settings form"))
    (.show ($ (+ "#" algorithm "-settings")))))
