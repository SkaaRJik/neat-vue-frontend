<template>
  <v-container>
    <v-row>
      <v-col v-if="errors.values_errors.length > 0">
        <v-card style="height: 100%">
          <v-card-title>
            {{ $t("VERIFICATION_VALUES_ERRORS") }}
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>
                      {{ $t("Column_name") }}
                    </th>
                    <th>
                      {{ $t("Error") }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in errors.values_errors"
                    :key="item.columnName"
                  >
                    <td>{{ item.columnName }}</td>
                    <td>{{ $t(item.error) }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="errors.header_errors.length > 0">
        <v-card style="height: 100%">
          <v-card-title>
            {{ $t("VERIFICATION_HEADER_ERRORS") }}
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>
                      {{ $t("Error") }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in errors.header_errors"
                    :key="item.columnName"
                  >
                    <td>{{ $t(item.error) }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="errors.legend_errors.length > 0">
        <v-card style="height: 100%">
          <v-card-title>
            {{ $t("VERIFICATION_LEGEND_ERRORS") }}
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>
                      {{ $t("Position") }}
                    </th>
                    <th>
                      {{ $t("Error") }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in errors.legend_errors"
                    :key="item.columnName"
                  >
                    <td>{{ item.position }}</td>
                    <td>{{ $t(item.error) }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "VerificationErrors",
  props: {
    errors: {
      header_errors: Array,
      legend_errors: Array,
      values_errors: Array
    }
  },
  data: () => {
    return {};
  }
};
</script>

<style scoped></style>
