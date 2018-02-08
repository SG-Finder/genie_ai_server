package com.finder.genie_ai.model;

import com.finder.genie_ai.model.game.BaseItemModel;
import lombok.Data;

import java.util.List;

@Data
public class BaseListItemModel {

    private List<? extends BaseItemModel> datas;
    private int cursor;
    private int count;

}