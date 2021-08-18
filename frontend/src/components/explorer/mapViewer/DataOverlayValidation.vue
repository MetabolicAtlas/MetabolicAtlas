<template>
  <div class="file is-centered mb-2">
    <label class="file-label">
      <input class="file-input" type="file" name="resume" @change="validateFile">
      <span class="file-cta">
        <span class="file-icon">
            <i class="fa fa-upload"></i>
        </span>
        <span class="file-label">
          Choose a file
        </span>
      </span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'DataOverlayValidation',
  methods: {
    validateFile(e) {
      if (e.target.files.length !== 0) {
        if (e.target.files[0].type !== 'text/tab-separated-values') {
          this.$emit('errorCustomFile', 'Error: expected TSV file');
          return;
        }
        let errors = '';
        const reader = new FileReader();
        reader.onloadend = (evt) => {
          const lines = evt.target.result.split(/\r?\n/);
          // No further checks if invalid TSV format
          if (lines[0].split('\t').length !== 1 && lines.length > 2) {
            lines[0].split('\t').forEach((name) => {
              if (name.length > 20) {
                errors += `Error: Column names should have max length of 20 characters, ${name} has ${name.length}\n`;
              }
            });
            lines.slice(1).forEach((line) => {
              const columnValues = line.split('\t');
              if (columnValues[0].length > 20) {
                errors += `Error: Id:s should have max length of 20 characters, ${columnValues[0]} has ${columnValues[0].length}\n`;
              }
              columnValues.slice(1).forEach((value) => {
                if (Number.isNaN(Number(value)) || value < 0 || value > 1) {
                  errors += `Error: ${value} is not a number between 0-1\n`;
                }
              });
            });
          } else {
            errors += 'Error: invalid TSV format, file should contain at least two columns and two rows';
          }
          if (errors !== '') {
            this.$emit('errorCustomFile', errors);
          } else {
            console.log(evt.target.result);
          }
        };
        reader.readAsText(e.target.files[0]);
      }
    },
  },
};
</script>
