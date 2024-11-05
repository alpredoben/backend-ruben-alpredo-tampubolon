/* eslint-disable no-shadow */
/* eslint-disable default-param-last */
class BasedResponse {
  static success(message, data = {}) {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message, error) {
    return {
      success: false,
      message,
      error,
    };
  }

  static pagination(
    message,
    data = [],
    totalItems,
    page = 1,
    limit = 10,
    baseUrl,
    query = {}
  ) {
    if (data.length > 0) {
      const totalPages = Math.ceil(totalItems / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      // build query
      const buildUrl = (page) => {
        query.page = page;
        query.limit = limit;

        const strQuery = new URLSearchParams(query).toString();

        return `${baseUrl}?${strQuery}`;
      };

      return {
        success: true,
        message,
        data: {
          items: data,
          pagination: {
            total_items: totalItems,
            total_pages: totalPages,
            current_page: page,
            item_per_page: limit,
            has_next_page: hasNextPage,
            has_prev_page: hasPrevPage,
            next_page: hasNextPage ? buildUrl(page + 1) : null,
            prev_page: hasPrevPage ? buildUrl(page - 1) : null,
            first_page: buildUrl(1),
            last_page: buildUrl(totalPages),
          },
        },
      };
    }

    return {
      success: false,
      message: 'Data not found',
      data: {
        items: data,
        pagination: {
          total_items: 0,
          total_pages: 0,
          current_page: page,
          item_per_page: limit,
          has_next_page: false,
          has_prev_page: false,
          next_page: null,
          prev_page: null,
          first_page: null,
          last_page: null,
        },
      },
    };
  }
}
module.exports = {
  // Main Class Based Response
  BasedResponse,

  // Get Success Response
  getSuccessResponse: (res, statusCode, message, data = {}) =>
    res.status(statusCode).json(BasedResponse.success(message, data)),

  // Get Error Response
  getErrorResponse: (res, statusCode, message, error = {}) =>
    res.status(statusCode).json(BasedResponse.error(message, error)),

  // Get Pagination Response
  getPaginationResponse: (
    req,
    res,
    statusCode,
    message,
    items = [],
    rowCount = 0
  ) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    return res
      .status(statusCode)
      .json(
        BasedResponse.pagination(
          message,
          items,
          rowCount,
          page,
          limit,
          baseUrl,
          req.query
        )
      );
  },

  mapingMessage: (success, code, message, data = null) => {
    if (success === false) {
      return {
        success,
        message,
        code,
      };
    }

    return {
      success,
      message,
      code,
      data,
    };
  },
};
