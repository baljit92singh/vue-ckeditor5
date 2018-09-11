export default {
  name: 'vue-ckeditor',

  render: createElement => createElement('div'),

  props: {
    config: {
      default: () => {
        return {
          language: 'en'
        }
      },
      required: false,
      type: Object
    },

    editors: {
      default: () => {
        return {}
      },
      required: false,
      type: Object
    },

    readonly: {
      default: () => false,
      required: false,
      type: Boolean
    },

    type: {
      required: true,
      type: String
    },

    value: {
      default: () => '',
      required: false,
      type: String
    }
  },

  data () {
    return {
      instance: null
    }
  },

  watch: {
    value: function (newValue) {
      const instance = this.instance

      if (
        instance != null &&
        newValue !== instance.getData()
      ) {
        instance.setData(newValue)
      }
    }
  },

  methods: {
    create: function () {
      if (this.instance == null) {
        const type = this.type
        const editors = this.$VueCkeditorEditors || this.editors

        if (!Object.keys(editors).length) {
          throw new Error(`There are no CKEditor 5 implementations.`)
        }

        const editor = editors[type]

        if (editor == null) {
          throw new Error(`Wrong key '${type}'. Allowed keys: ${Object.keys(editors)}`)
        }

        editor
          .create(this.$el, this.config)
          .then(editor => {
            this.instance = editor
            this.$emit('ready', editor)

            const instance = this.instance
            instance.isReadOnly = this.readonly
            instance.model.document.on('change', this.update)
            instance.setData(this.value)
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    destroy: function () {
      const instance = this.instance

      if (instance != null) {
        instance.destroy()
      }
    },
    update: function () {
      const value = this.instance.getData()

      if (this.value !== value) {
        this.$emit('input', value)
      }
    }
  },

  mounted () {
    this.create()
  },

  beforeDestroy () {
    this.destroy()
  }
}
