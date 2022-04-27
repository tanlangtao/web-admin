import React from "react";
import { Table } from "antd";
const Mytable = ({ tableData, paginationOnchange, setPagination, ...rest }) => {
    // console.log("table渲染了！！");
    const {
        data,
        columns,
        count,
        x,
        y,
        current,
        pageSize,
        loading,
        defaultPageSize,
        defaultCurrent,
    } = tableData;
    const paginationConfig = {
        defaultPageSize,
        defaultCurrent,
        current,
        pageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        total: count,
        pageSizeOptions: ["10", "20", "30", "50"],
        showTotal: (total, range) => `共${total}条`,
        onChange: (page, size) => {
            paginationOnchange(page, size);
            setPagination(page);
        },
        onShowSizeChange: (page, size) => {
            paginationOnchange(1, size);
            setPagination(1, size);
        },
    };
    return (
        <>
            <Table
                bordered
                // tableLayout=""
                rowKey={(record, index) => `${index}`}
                dataSource={data || []}
                columns={columns}
                size="small"
                pagination={paginationConfig}
                loading={loading}
                scroll={{
                    x: x,
                    y: y,
                    scrollToFirstRowOnChange: true,
                }}
                {...rest}
            />
        </>
    );
};
function areEqual(prevProps, nextProps) {
    //避免memo的浅对比，根据data的变化决定是否更新table组件
    // console.log("prevProps-------------", prevProps);
    // console.log("nextProps-------------", nextProps);
    if (
        prevProps.tableData.data === nextProps.tableData.data &&
        prevProps.tableData.loading === nextProps.tableData.loading
    ) {
        // console.log("prevProps===nextProps");
        return true;
    } else {
        // console.log("prevProps!==nextProps");
        return false;
    }
}
export default React.memo(Mytable, areEqual);
