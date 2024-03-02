package aor.paj.bean;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.Category;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

import static org.junit.jupiter.api.Assertions.assertFalse;

@RunWith(MockitoJUnitRunner.class)
class CategoryBeanTest {

    @Mock
    private UserDao userDao;

    @Mock
    private CategoryDao categoryDao;

    @InjectMocks
    private CategoryBean categoryBean;

    @BeforeEach
    public void setUp() {

        MockitoAnnotations.initMocks(this);
        this.categoryBean = new CategoryBean();
        this.categoryDao = new CategoryDao();
        this.userDao = new UserDao();
    }

    @Test
    void addCategory() {

        //arrange
        CategoryBean categoryBeanHelper = build();
        Category category = new Category();
        String token = "token";

        //act

        boolean result = categoryBeanHelper.addCategory(token, category);

        //assert

        assertFalse(result);


    }

    CategoryBean build()  {
        CategoryBean categoryBean = new CategoryBean();
        return categoryBean;
    }
}