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
import { default as messages } from '@/content/messages';

export default {
  name: 'DataOverlayValidation',
  methods: {
    validateFile(e) {
      if (e.target.files.length !== 0) {
        if (e.target.files[0].type !== 'text/tab-separated-values') {
          this.$emit('errorCustomFile', `Error: ${messages.noTSVfile}`, e.target.files[0].name);
          return;
        }
        let errors = '';
        const reader = new FileReader();
        reader.onloadend = (evt) => {
          const lines = evt.target.result.split(/\r?\n/);
          const header = lines[0].split('\t');
          if (header[0] !== 'id') {
            errors += `Error: ${messages.noIDColumn}. First column should not be ${header[0]}\n`;
          }
          // No further checks if invalid TSV format
          if (header.length !== 1 && lines.length > 2) {
            header.forEach((name) => {
              if (name.length > 20) {
                errors += `Error: ${messages.columnNameLength}, ${name} has ${name.length}\n`;
              }
            });
            lines.slice(1).forEach((line) => {
              const columnValues = line.split('\t');
              if (columnValues[0].length > 20) {
                errors += `Error: ${messages.idNameLenght}, ${columnValues[0]} has ${columnValues[0].length}\n`;
              }
              columnValues.slice(1).forEach((value) => {
                if (Number.isNaN(Number(value)) || value < 0 || value > 1) {
                  errors += `Error: ${value} ${messages.levelsRange}\n`;
                }
              });
            });
          } else {
            errors += `Error: ${messages.invalidTSV}`;
          }
          if (errors !== '') {
            this.$emit('errorCustomFile', errors, e.target.files[0].name);
          } else {
            this.$emit('getFileName', e.target.files[0]);
          }
        };
        reader.readAsText(e.target.files[0]);
      }
    },
  },
};
</script>
